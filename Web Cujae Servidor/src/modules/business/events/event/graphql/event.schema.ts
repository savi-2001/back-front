import { Field, ID, InputType, ObjectType, PartialType } from '@nestjs/graphql'
import { BaseType, Json } from '@regiondev/nestjs-graphql'

@InputType()
export class CreateEventInput {
	@Field()
	startDate?: Date
	endDate?: Date
	eventAttendanceMode?: string
	eventStatus?: string
	location?: string
	images?: string[]
	title?: string
	description?: string
}

@InputType()
export class UpdateEventInput extends PartialType(CreateEventInput) {
	id?: string
}

@ObjectType()
export class Event extends BaseType {
	@Field()
	startDate?: Date
	endDate?: Date
	eventAttendanceMode?: string
	eventStatus?: string
	location?: string
	images?: string[]
	title?: string
	description?: string
}
