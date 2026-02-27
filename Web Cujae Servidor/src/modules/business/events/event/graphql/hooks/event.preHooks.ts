import { PreHooksFunctions } from '@regiondev/nestjs-graphql'
import { Event } from '../../models/event.model'
import { EventService } from '../../event.service'

export function eventPreHooks(eventService: EventService): PreHooksFunctions<Event> {
	return {}
}
