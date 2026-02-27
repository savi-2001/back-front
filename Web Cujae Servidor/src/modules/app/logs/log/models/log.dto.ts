import { BaseDto, ALWAYS, ON_UPDATE, ON_CREATE } from '@regiondev/nestjs-common'
import { Log } from './log.model'
import { IsString, IsOptional, IsNumber, IsObject } from 'class-validator'

export class LogDto extends BaseDto<Log> {
	@IsString(ALWAYS)
	@IsOptional(ALWAYS)
	host: string

	@IsString(ALWAYS)
	@IsOptional(ALWAYS)
	remote_addr: string

	@IsString(ALWAYS)
	@IsOptional(ALWAYS)
	time_local: string

	@IsString(ALWAYS)
	@IsOptional(ALWAYS)
	method: string

	@IsString(ALWAYS)
	@IsOptional(ALWAYS)
	path: string

	@IsString(ALWAYS)
	@IsOptional(ALWAYS)
	protocol: string

	@IsNumber({}, ALWAYS)
	@IsOptional(ALWAYS)
	status: number

	@IsNumber({}, ALWAYS)
	@IsOptional(ALWAYS)
	body_bytes_sent: number

	@IsString(ALWAYS)
	@IsOptional(ALWAYS)
	http_referer: string

	@IsString(ALWAYS)
	@IsOptional(ALWAYS)
	http_user_agent: string

	@IsString(ALWAYS)
	@IsOptional(ALWAYS)
	http_x_forwarded_for: string

	@IsString(ALWAYS)
	@IsOptional(ALWAYS)
	os: string

	@IsString(ALWAYS)
	@IsOptional(ALWAYS)
	browser: string

	@IsString(ALWAYS)
	@IsOptional(ALWAYS)
	country_code: string

	@IsObject(ALWAYS)
	@IsOptional(ALWAYS)
	metadata: SRecord
}
