import { ALWAYS, BaseDto, IsValidMongoId, ON_UPDATE } from '@regiondev/nestjs-common'
import { IsOptional, IsString, ValidateIf } from 'class-validator'

export class ResourceGrantDto extends BaseDto<ResourceGrantDto> {
	@IsOptional(ON_UPDATE)
	@IsString(ALWAYS)
	public resource

	@IsString(ALWAYS)
	@IsOptional(ON_UPDATE)
	public permission: string

	@IsOptional(ON_UPDATE)
	@IsString(ALWAYS)
	@ValidateIf((obj, _) => !obj.userId, ALWAYS)
	public roleName: string

	@IsOptional(ON_UPDATE)
	@IsValidMongoId(ALWAYS)
	@ValidateIf((obj, _) => !obj.roleName, ALWAYS)
	public userId: string
}
