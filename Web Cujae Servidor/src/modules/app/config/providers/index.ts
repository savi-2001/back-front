import { Logger, Provider } from '@nestjs/common'
import { COMPLEXITY_OPTIONS, DEFAULT_GRAPHQL_CACHE_TTL } from '@regiondev/nestjs-graphql'
import {
	ENCRYPTION_PRIVATE_KEY,
	GET_RSA_PUBLIC_KEY,
	GET_RSA_PRIVATE_KEY,
	JWKS_URI,
	ALLOW_REST_WITHOUT_ENCRYPTION,
	ALLOW_GRAPHQL_WITHOUT_ENCRYPTION,
	REST_ENCRYPTION_CLIENT_SECRET,
} from '@regiondev/nestjs-security'
import config from '~config'
import { getRsaPrivateKey, getRsaPublicKey } from './getJwkProvider'

const { GRAPHQL_CACHE_TTL, GRAPHQL_MAX_ALLOWED_COMPLEXITY } = process.env

export const GLOBAL_PROVIDERS: Provider[] = [
	{ provide: ENCRYPTION_PRIVATE_KEY, useValue: config.privateKey },
	{ provide: ALLOW_REST_WITHOUT_ENCRYPTION, useValue: config.allowRestWithoutEncryption },
	{ provide: ALLOW_GRAPHQL_WITHOUT_ENCRYPTION, useValue: config.allowGraphQlWithoutEncryption },
	{ provide: REST_ENCRYPTION_CLIENT_SECRET, useValue: config.encryptionClientSecret },
	{ provide: JWKS_URI, useValue: config.jwksUri },
	{ provide: GET_RSA_PUBLIC_KEY, useValue: getRsaPublicKey },
	{ provide: GET_RSA_PRIVATE_KEY, useValue: getRsaPrivateKey },
	{ provide: DEFAULT_GRAPHQL_CACHE_TTL, useValue: parseInt(GRAPHQL_CACHE_TTL) },
	{
		provide: COMPLEXITY_OPTIONS,
		useValue: { maxAllowedComplexity: parseInt(GRAPHQL_MAX_ALLOWED_COMPLEXITY) },
	},
]
