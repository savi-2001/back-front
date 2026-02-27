import { Field, ID, InputType, ObjectType, PartialType } from '@nestjs/graphql'
import { BaseType } from '@regiondev/nestjs-graphql'

@InputType()
export class CreateResourceGrantInput {
	resource: string
	permission: string
	roleName?: string
	userId?: string
}

@InputType()
export class UpdateResourceGrantInput extends PartialType(CreateResourceGrantInput) {
	@Field((type) => ID)
	id: string
}

@ObjectType()
export class ResourceGrant extends BaseType {
	resource: string
	permission: string
	roleName?: string
	userId?: string
}
