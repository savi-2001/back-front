import { Field, ID, InputType, ObjectType, PartialType } from '@nestjs/graphql'
import { BaseType, Json } from '@regiondev/nestjs-graphql'

@InputType()
export class CreatePageViewInput {
	@Field()
	path?: string
	ip?: string
	referer?: string
	os?: string
	browser?: string
	country_code?: string
	http_user_agent?: string
}

@InputType()
export class UpdatePageViewInput extends PartialType(CreatePageViewInput) {
	id?: string
}

@ObjectType()
export class PageView extends BaseType {
	@Field()
	path?: string
	ip?: string
	referer?: string
	os?: string
	browser?: string
	country_code?: string
	http_user_agent?: string
}
