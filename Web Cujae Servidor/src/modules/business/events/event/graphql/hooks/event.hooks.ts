import { Injectable } from '@nestjs/common'
import { eventPreHooks } from './event.preHooks'
import { eventPostHooks } from './event.postHooks'
import { EventService } from '../../event.service'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class EventHooks {
	constructor(private eventService: EventService, private eventEmitter: EventEmitter2) {}

	public get preHooks() {
		return eventPreHooks(this.eventService)
	}
	public get postHooks() {
		return eventPostHooks(this.eventEmitter)
	}
}
