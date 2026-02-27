import { Logger } from '@nestjs/common'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { ComplexityPlugin, GqlLoggingInterceptor, HttpGqlExceptionFilter } from '@regiondev/nestjs-graphql'
import {
	ApolloEncryptionPlugin,
	ENCRYPTION_PRIVATE_KEY,
	GlobalThrottlerGuard,
	RestEncryptionRequestInterceptor,
	RestEncryptionResponseInterceptor,
} from '@regiondev/nestjs-security'
import config from '~config'

export const APP_PROVIDERS = [
	{
		provide: APP_FILTER,
		useClass: HttpGqlExceptionFilter,
	},
	{
		provide: APP_GUARD,
		useClass: GlobalThrottlerGuard,
	},
	...(config.enableEncryption
		? [
			{
				provide: APP_INTERCEPTOR,
				useClass: RestEncryptionRequestInterceptor,
			},
			{
				provide: APP_INTERCEPTOR,
				useClass: RestEncryptionResponseInterceptor,
			},
			ApolloEncryptionPlugin,
		]
		: []),
	{
		provide: APP_INTERCEPTOR,
		useClass: GqlLoggingInterceptor,
	},
	ComplexityPlugin,
	{ provide: ENCRYPTION_PRIVATE_KEY, useValue: config.privateKey },
]
