import { Field, ID, InputType, ObjectType, PartialType } from '@nestjs/graphql'
import { BaseType } from '@regiondev/nestjs-graphql'

@InputType()
export class CreateRoleInput {
	name: string
	parentName?: string
}

@InputType()
export class UpdateRoleInput extends PartialType(CreateRoleInput) {
	@Field((type) => ID)
	id: string
}

@ObjectType()
export class Role extends BaseType {
	name: string
	parentName?: string
}
