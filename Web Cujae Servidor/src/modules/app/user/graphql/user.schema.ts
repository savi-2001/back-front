import { Field, ID, InputType, ObjectType, PartialType } from '@nestjs/graphql'
import { BaseType, Json } from '@regiondev/nestjs-graphql'

@InputType()
export class CreateUserInput {
	email: string
	name: string
	accountStatus?: string

	@Field((type) => Json, { nullable: true })
	meta?: SRecord
}

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
	id?: string
}

@ObjectType()
export class User extends BaseType {
	email: string
	name: string
	accountStatus?: string
	@Field((type) => [String], { nullable: false })
	roles: string[]

	@Field((type) => Json, { nullable: true })
	meta?: SRecord
}
