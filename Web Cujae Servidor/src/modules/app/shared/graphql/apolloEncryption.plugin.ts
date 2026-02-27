import { ApolloServerPlugin, GraphQLRequestListener } from '@apollo/server'
import { Plugin } from '@nestjs/apollo'
import { CryptoHelper } from '@regiondev/nestjs-security'
import config from '~config'

@Plugin()
export class ApolloEncryptionPlugin implements ApolloServerPlugin {
	async requestDidStart(): Promise<GraphQLRequestListener<any>> {
		return {
			async willSendResponse(requestContext) {
				const cryptoHelper = new CryptoHelper(config.privateKey)
				const body: any = requestContext.response.body

				const key = requestContext.request.http.headers.get('encryptKey')

				if (key) {
					const data = body.singleResult.data
					const errors = body.singleResult.errors
					const encData = cryptoHelper.AesEncryptForJs(JSON.stringify(data), key)
					const encErrors = cryptoHelper.AesEncryptForJs(JSON.stringify(errors), key)
					body.singleResult.data = encData
					body.singleResult.errors = encErrors
					requestContext.response.body = body
				}
			},
		}
	}
}
