import loadEnvironments from '../environments/environment'
import { IConfigOptions } from './IConfigOptions.interface'

loadEnvironments()
const HOST = `http://localhost:${process.env.PORT}`

export const config: IConfigOptions = {
	enableLogErrors: false,
	enableEncryption: JSON.parse(process.env.ENCRYPT_DATA ?? 'false'),
	privateKey: process.env.PRIVATE_KEY,
	publicKey: process.env.PUBLIC_KEY,
	encryptionClientSecret: process.env.CLIENT_SECRET,
	mongoUrl: process.env.MONGO_URL,
	introspection: true,
	apolloServerDebug: true,
	allowRestWithoutEncryption: false,
	allowGraphQlWithoutEncryption: false,
	allowedOriginCors: ['*'],
	host: HOST,
	jwksUri: `${HOST}/.well-known/jwks.object`,
	frontendHost: 'http://localhost:4100',
	maximumAllowedComplexity: 100,

	minio: {
		endPoint: process.env.MINIO_ENDPOINT,
		endPointUrl: process.env.MINIO_ENDPOINT_URL,
		port: +process.env.MINIO_PORT,
		accessKey: process.env.MINIO_ACCESS_KEY,
		secretKey: process.env.MINIO_SECRET_KEY,
		bucketName: process.env.MINIO_BUCKET_NAME,
	},
	CAPTCHA_KEY: process.env.CAPTCHA_KEY,
}
