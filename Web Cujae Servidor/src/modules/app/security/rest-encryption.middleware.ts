import { BadRequestException, Inject, Injectable, NestMiddleware } from '@nestjs/common'
import { CryptoHelper, ENCRYPTION_PRIVATE_KEY } from '@regiondev/nestjs-security'
import { Request, Response } from 'express'
import { buildUrlWithQueryParams } from '../shared/utils/utils'

@Injectable()
export class RestEncryptionMiddleware implements NestMiddleware {
	private cryptoHelper: CryptoHelper

	constructor(@Inject(ENCRYPTION_PRIVATE_KEY) private encryption_private_key: string) {
		this.cryptoHelper = new CryptoHelper(this.encryption_private_key)
	}

	use(req: Request & Record<string, any>, res: Response, next: () => void) {
		const { body } = req

		const sq = new URLSearchParams(req.url)

		const __encKey = req.get('a2V5')
		let __encPath = sq.get('ZGF0YQ') || sq.get('/?ZGF0YQ')
		let __encParams = sq.get('TYU8Q')

		if (!__encKey) {
			return next()
		}

		__encPath = __encPath?.split(' ').join('')
		__encParams = __encParams?.split?.(' ').join?.('').trim()

		if (!__encPath) throw new BadRequestException('Invalid url')

		const __aesKey = this.cryptoHelper.RSAPrivateDecrypt(__encKey, this.cryptoHelper.getRSAPrivateKey())

		if (!__aesKey || !__aesKey.match(/^[A-Za-z0-9]{16}$/)) return next()

		let __rawStrPath = this.cryptoHelper.AesDecryptForJs(__encPath, __aesKey as string)
		if (__rawStrPath == '/') __rawStrPath = ''

		let __rawStrParams, __rawStrBody

		if (__encParams) {
			__rawStrParams = this.cryptoHelper.AesDecryptForJs(__encParams, __aesKey as string)
		}
		if (!__rawStrParams?.trim()) __rawStrParams = '{}'

		if (body['ZGF0YQ']) {
			__rawStrBody = this.cryptoHelper.AesDecryptForJs(body['ZGF0YQ'], __aesKey as string)
		}
		if (!__rawStrBody?.trim()) __rawStrBody = '{}'

		const params: Record<string, string> = JSON.parse(__rawStrParams)

		req.query = params

		const url = buildUrlWithQueryParams(`/${__rawStrPath}`, params)
		req.url = url
		req.originalUrl = url
		req.body = JSON.parse(__rawStrBody)
		req.encryptKey = __aesKey as string
		req.headers.encryptKey = __aesKey as string
		next()
	}
}
