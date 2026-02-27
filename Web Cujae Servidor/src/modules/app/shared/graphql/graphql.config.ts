import { ApolloDriverConfig } from '@nestjs/apollo'
import { Injectable, Logger } from '@nestjs/common'
import { GqlOptionsFactory } from '@nestjs/graphql'
import { RedisService } from '@regiondev/nestjs-integrations'
import { validateToken } from '@regiondev/nestjs-security'
import { BaseRedisCache } from 'apollo-server-cache-redis'
import responseCachePlugin from 'apollo-server-plugin-response-cache'
import jwtDecode from 'jwt-decode'
import config, { isProd } from '~config'
import { AuthService } from '../../auth/auth.service'

const responsePlugin: any = responseCachePlugin

@Injectable()
export class GraphqlOptions implements GqlOptionsFactory {
	constructor(private readonly authService: AuthService, private readonly redisService: RedisService) {}

	onConnect = async (context) => {
		const { connectionParams } = context

		if (connectionParams.authToken) {
			try {
				const id = await validateToken(connectionParams.authToken, this.authService.privateKey)
				if (id) {
					const user = await this.authService.validateUser({ sub: id })
					context.extra.user = user
				} else {
					throw new Error('Invalid auth token!')
				}
			} catch (e) {
				Logger.error(e, 'Failed validation of auth token on connection to websocket')
			}
		}
	}

	context = async ({ req, res, extra }) => {
		if (req) {
			// Here is a HTTP request
			return { headers: req.headers, req, res }
		} else if (extra) {
			// Here is a Websocket request
			const rawHeaders = extra.request.rawHeaders
			const wsContext = {
				origin: rawHeaders[13],
				userAgent: rawHeaders[19],
			}

			return { user: extra.user, wsContext }
		}
	}

	createGqlOptions(): ApolloDriverConfig {
		const { introspection, apolloServerDebug } = config
		return {
			// cors: {
			// 	origin: config.allowedOriginCors,
			// 	credentials: true,
			// },
			useGlobalPrefix: true,
			autoSchemaFile: 'schema.gql',
			subscriptions: {
				'graphql-ws': {
					path: '/subscriptions',
					onConnect: this.onConnect,
				},
			},
			// formatResponse: formatResponse as any,
			// formatResponse: (res) => {
			// 	Logger.verbose('res')
			// 	return res
			// },

			introspection:true,
			context: this.context,
			installSubscriptionHandlers: true,
			buildSchemaOptions: {
				numberScalarMode: 'integer',
				scalarsMap: [],
			},
			cache: new BaseRedisCache({
				client: this.redisService.redis.getClient(),
			}),
			plugins: [
				responsePlugin({
					sessionId: (requestContext) => {
						const headers = requestContext.contextValue.headers
						const jwt = headers.authorization || headers.Authorization

						if (!jwt || !jwt.startsWith('Bearer ')) {
							return null
						}
						const decode: any = jwtDecode(jwt.split('Bearer ')[1])
						return decode.sub ?? null
					},
				}),
			],
			// validationRules: [depthLimit(10)],
			includeStacktraceInErrorResponses: !isProd(),
			formatError(error) {
				if (!isProd() && config.enableLogErrors) {
					Logger.error(error, 'Development error log')

					if (typeof error.message == 'string' && JSON.parse(error.message).response) {
						const graphQLFormattedError = JSON.parse(error?.message)
						return graphQLFormattedError
					} else if (error?.message) {
						return error.message
					}
					const graphQLFormattedError = JSON.parse(
						(error?.extensions?.exception as any)?.response?.message,
					)
					return graphQLFormattedError
				}

				return error
			},
		}
	}
}
