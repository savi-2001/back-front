import { Controller, Get, Inject, Logger, UseInterceptors } from '@nestjs/common'
import { CacheConfig, HttpCacheInterceptor } from '@regiondev/nestjs-common'
import { GET_RSA_PUBLIC_KEY, IgnoreEncryption, Throttler } from '@regiondev/nestjs-security'
import crypto from 'crypto'
import rsaPemToJwk from 'rsa-pem-to-jwk'

@Controller('.well-known')
@IgnoreEncryption()
export class JwksRsaController {
	@Inject(GET_RSA_PUBLIC_KEY) getPublicKey: () => Buffer

	@Get('jwks.object')
	@Throttler({ limit: 5, ttl: 60 })
	@CacheConfig([60, 'PUBLIC'])
	@UseInterceptors(HttpCacheInterceptor)
	jwks() {
		Logger.log('jwks-rsa called', 'JwksRsaController')

		const publicKey = this.getPublicKey()

		const jwk = []
		const keyid = crypto.createHash('sha256').update(publicKey).digest('hex')
		jwk.push(rsaPemToJwk(publicKey, { use: 'sig', alg: 'RSA256', kid: keyid }, 'public'))

		return { keys: jwk }
	}
}
