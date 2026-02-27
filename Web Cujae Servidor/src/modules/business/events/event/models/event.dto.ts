import { BaseDto, ALWAYS, ON_UPDATE, ON_CREATE } from '@regiondev/nestjs-common'
import { Event } from './event.model'
import { IsDate, IsOptional, IsString, IsArray } from 'class-validator'

export class EventDto extends BaseDto<Event> {
	@IsDate(ALWAYS)
	@IsOptional(ALWAYS)
	startDate: Date

	@IsDate(ALWAYS)
	@IsOptional(ALWAYS)
	endDate: Date

	@IsString(ALWAYS)
	@IsOptional(ALWAYS)
	eventAttendanceMode: string

	@IsString(ALWAYS)
	@IsOptional(ALWAYS)
	eventStatus: string

	@IsString(ALWAYS)
	@IsOptional(ALWAYS)
	location: string

	@IsString({ ...ALWAYS, each: true })
	@IsOptional(ALWAYS)
	@IsArray(ALWAYS)
	images: string[]

	@IsString(ALWAYS)
	@IsOptional(ALWAYS)
	title: string

	@IsString(ALWAYS)
	@IsOptional(ALWAYS)
	description: string
}
