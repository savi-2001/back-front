import { IsOptional, IsString } from 'class-validator'
import { ALWAYS, BaseDto, IsValidMongoId } from '@regiondev/nestjs-common'

export class RoleDto extends BaseDto<RoleDto> {
	@IsString(ALWAYS)
	public name: string

	@IsOptional(ALWAYS)
	@IsString(ALWAYS)
	public parentName: string
}
