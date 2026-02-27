import { Field, ID, InputType, ObjectType, PartialType } from '@nestjs/graphql'
import { BaseType, Json } from '@regiondev/nestjs-graphql'

@InputType()
export class CreateLogInput {
	@Field()
	host?: string
	remote_addr?: string
	time_local?: string
	method?: string
	path?: string
	protocol?: string
	status?: number
	body_bytes_sent?: number
	http_referer?: string
	http_user_agent?: string
	http_x_forwarded_for?: string
	browser?: string
	os?: string
	country_code?: string

	@Field((type) => Json, { nullable: true })
	metadata?: SRecord
}

@InputType()
export class UpdateLogInput extends PartialType(CreateLogInput) {
	id?: string
}

@ObjectType()
export class Log extends BaseType {
	@Field()
	host?: string
	remote_addr?: string
	time_local?: string
	method?: string
	path?: string
	protocol?: string
	status?: number
	body_bytes_sent?: number
	http_referer?: string
	http_user_agent?: string
	http_x_forwarded_for?: string
	browser?: string
	os?: string
	country_code?: string

	@Field((type) => Json, { nullable: true })
	metadata?: SRecord
}
