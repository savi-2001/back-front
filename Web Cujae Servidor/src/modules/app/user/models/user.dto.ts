import { BaseDto, ALWAYS, ON_UPDATE, ON_CREATE } from '@regiondev/nestjs-common'
import { User } from './user.model'
import { IsString, IsOptional, IsObject, Allow } from 'class-validator'

export class UserDto extends BaseDto<User> {
	@IsString(ALWAYS)
	@IsOptional(ALWAYS)
	passwordHash: string

	@IsString(ALWAYS)
	@IsOptional(ALWAYS)
	salt: string

	@Allow(ALWAYS)
	@IsOptional(ALWAYS)
	password: string

	@IsString(ALWAYS)
	@IsOptional(ALWAYS)
	email: string

	@IsString(ALWAYS)
	@IsOptional(ALWAYS)
	name: string

	@IsString(ALWAYS)
	@IsOptional(ALWAYS)
	accountStatus: string

	@IsObject(ALWAYS)
	@IsOptional(ALWAYS)
	meta: SRecord
}
