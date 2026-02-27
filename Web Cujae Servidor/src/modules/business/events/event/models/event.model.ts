import { modelOptions, pre, Ref, prop, index } from '@typegoose/typegoose'
import { MongoBase, schemaOptions } from '@regiondev/nestjs-common'

@modelOptions(schemaOptions(Event.model_name))
export class Event extends MongoBase {
	@prop({ required: false })
	public startDate: Date

	@prop({ required: false })
	public endDate: Date

	@prop({
		default: () => {
			return 'OfflineEventAttendanceMode'
		},
		required: false,
	})
	public eventAttendanceMode: EventAttendanceModeEnum

	@prop({
		default: () => {
			return 'EventScheduled'
		},
		required: false,
	})
	public eventStatus: EventStatusEnum

	@prop({ required: false })
	public location: string

	@prop({ required: false })
	public images: string[]

	@prop({ required: false })
	public title: string

	@prop({})
	public description: string

	static model_name = 'event'
}

export enum EventAttendanceModeEnum {
	MixedEventAttendanceMode = 'MixedEventAttendanceMode',
	OfflineEventAttendanceMode = 'OfflineEventAttendanceMode',
	OnlineEventAttendanceMode = 'OnlineEventAttendanceMode',
}

export enum EventStatusEnum {
	EventCancelled = 'EventCancelled',
	EventMovedOnline = 'EventMovedOnline',
	EventPostponed = 'EventPostponed',
	EventRescheduled = 'EventRescheduled',
	EventScheduled = 'EventScheduled',
}
