import { BaseDto, ALWAYS, ON_UPDATE, ON_CREATE } from '@regiondev/nestjs-common'
import { Ticket } from './ticket.model'
import { IsString, IsOptional, MaxLength, IsEmail, IsNumber, Min, Max, IsObject } from 'class-validator'

export class TicketDto extends BaseDto<Ticket> {
	@IsString(ALWAYS)
	@MaxLength(120, ALWAYS)
	@IsOptional(ALWAYS)
	@IsEmail(ALWAYS)
	sender_email: string

	@IsString(ALWAYS)
	@MaxLength(100, ALWAYS)
	@IsOptional(ALWAYS)
	sender_name: string

	@IsString(ALWAYS)
	@MaxLength(10000, ALWAYS)
	@IsOptional(ALWAYS)
	question: string

	@IsString(ALWAYS)
	@IsOptional(ALWAYS)
	@MaxLength(100000, ALWAYS)
	answer: string

	@IsString(ALWAYS)
	@IsOptional(ALWAYS)
	status: string

	// @IsNumber({}, ALWAYS)
	// @Min(1, ALWAYS)
	// @Max(5, ALWAYS)
	// @IsOptional(ALWAYS)
	// answer_rating: number

	@IsObject(ALWAYS)
	@IsOptional(ALWAYS)
	metadata: SRecord

	@IsString(ALWAYS)
	@IsOptional(ALWAYS)
	uid: string
}
