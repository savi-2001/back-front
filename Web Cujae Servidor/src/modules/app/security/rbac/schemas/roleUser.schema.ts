import { Field, ID, InputType, ObjectType, PartialType } from '@nestjs/graphql'
import { BaseType } from '@regiondev/nestjs-graphql'

@InputType()
export class CreateRoleUserInput {
	userId: string
	roleName: string
}

@InputType()
export class UpdateRoleUserInput extends PartialType(CreateRoleUserInput) {
	@Field((type) => ID)
	id: string
}

@ObjectType()
export class RoleUser extends BaseType {
	userId: string
	roleName: string
}
