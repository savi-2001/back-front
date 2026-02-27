import { Field, ID, InputType, ObjectType, PartialType } from '@nestjs/graphql'
import { BaseType, Json } from '@regiondev/nestjs-graphql'

@InputType()
export class CreateTicketInput {
	@Field()
	sender_email?: string
	sender_name?: string
	question: string
	answer?: string
	status?: string
	// answer_rating?: number

	@Field((type) => Json, { nullable: true })
	metadata?: SRecord
	uid?: string
}

@InputType()
export class UpdateTicketInput extends PartialType(CreateTicketInput) {
	id?: string
}

@ObjectType()
export class Ticket extends BaseType {
	@Field()
	sender_email?: string
	sender_name?: string
	question: string
	answer?: string
	status?: string
	// answer_rating?: number

	@Field((type) => Json, { nullable: true })
	metadata?: SRecord
	uid?: string
}
