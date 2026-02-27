import loadEnvironments from '../environments/environment'
import { IConfigOptions } from './IConfigOptions.interface'

loadEnvironments()

const HOST = `http://localhost:${process.env.PORT}`

export const config: IConfigOptions = {
	privateKey: process.env.PRIVATE_KEY,
	enableEncryption: JSON.parse(process.env.ENCRYPT_DATA ?? 'false'),
	publicKey: process.env.PUBLIC_KEY,
	encryptionClientSecret: process.env.CLIENT_SECRET,
	mongoUrl: process.env.MONGO_URL,
	introspection: false,
	apolloServerDebug: false,
	allowRestWithoutEncryption: false,
	allowGraphQlWithoutEncryption: false,
	// allowedOriginCors: ['https://cujae.regiondev.org', '*'], // put here origins
	allowedOriginCors: ['*'],
	host: HOST,
	jwksUri: `${HOST}/.well-known/jwks.object`,
	frontendHost: 'http://localhost:4100',
	throttlerIgnoreAgents: [/googlebot/gi, /bingbot/gi],
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
