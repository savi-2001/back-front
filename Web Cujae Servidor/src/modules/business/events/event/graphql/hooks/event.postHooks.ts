import { EventEmitter2 } from '@nestjs/event-emitter'
import { PostHooksFunctions } from '@regiondev/nestjs-graphql'
import { Event } from '../../models/event.model'

export function eventPostHooks(eventEmitter: EventEmitter2): PostHooksFunctions<Event> {
	return {}
}
