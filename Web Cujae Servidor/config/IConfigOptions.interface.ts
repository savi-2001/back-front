export interface IConfigOptions {
	enableEncryption?: boolean
	enableLogErrors?: boolean
	publicKey: string
	privateKey: string
	encryptionClientSecret: string
	introspection: boolean
	allowRestWithoutEncryption: boolean
	allowGraphQlWithoutEncryption: boolean
	apolloServerDebug: boolean
	mongoUrl: string
	host: string
	jwksUri: string
	frontendHost: string
	allowedOriginCors?: string[] | string
	throttlerIgnoreAgents?: RegExp[]
	maximumAllowedComplexity: number
	minio?: {
		endPoint: string
		endPointUrl: string
		port: number
		accessKey: string
		secretKey: string
		bucketName: string
	}
	CAPTCHA_KEY: string
}
