import { Injectable } from '@nestjs/common'
import { eventPreHooks } from './event.restPreHooks'
import { eventPostHooks } from './event.restPostHooks'
import { EventService } from '../../event.service'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class EventRestHooks {
	constructor(private eventService: EventService, private eventEmitter: EventEmitter2) {}

	public get preHooks() {
		return eventPreHooks(this.eventService)
	}
	public get postHooks() {
		return eventPostHooks(this.eventEmitter)
	}
}
