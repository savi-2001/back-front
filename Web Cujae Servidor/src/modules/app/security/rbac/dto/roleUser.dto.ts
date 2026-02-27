import { ALWAYS, BaseDto, IsValidMongoId, ON_UPDATE } from '@regiondev/nestjs-common'
import { IsOptional, IsString } from 'class-validator'

export class RoleUserDto extends BaseDto<RoleUserDto> {
	@IsOptional(ON_UPDATE)
	@IsValidMongoId(ALWAYS)
	public userId: string

	@IsOptional(ON_UPDATE)
	@IsString(ALWAYS)
	public roleName: string
}
