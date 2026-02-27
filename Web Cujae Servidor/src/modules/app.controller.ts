import { HttpService } from '@nestjs/axios'
import { BadRequestException, Body, Controller, Get, Inject, Logger, Param, Post } from '@nestjs/common'
import { CacheService } from '@regiondev/nestjs-common'
import { SkipLogs } from '@regiondev/nestjs-graphql'
import config from '~config'

@Controller('app')
export class AppController {
	@Inject(HttpService) http: HttpService
	@Inject(CacheService) cacheService: CacheService
	/**
	 * App server date
	 * @example { date: 1668611054892 }
	 * @status 200
	 */
	@Get('date')
	@SkipLogs()
	getDate() {
		return Date.now()
	}

	@Get('date/app')
	@SkipLogs()
	getDate2() {
		return Date.now()
	}

	@Post('verify-recaptcha')
	async verify(@Body('token') token) {
		if (!token) throw new BadRequestException()
		const { CAPTCHA_KEY } = config

		const res = await this.http
			.post(`https://www.google.com/recaptcha/api/siteverify?secret=${CAPTCHA_KEY}&response=${token}`)
			.toPromise()

		const success = res.data?.score < 0.6 ? false : res.data?.success

		return {
			success,
			errors: res.data?.['error-codes'],
		}
	}
}
