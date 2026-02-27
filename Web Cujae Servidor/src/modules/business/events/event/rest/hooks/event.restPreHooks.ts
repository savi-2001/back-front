import { PreHooksRestFunctions } from '@regiondev/nestjs-common'
import { Event } from '../../models/event.model'
import { EventService } from '../../event.service'

export function eventPreHooks(eventService: EventService): PreHooksRestFunctions<Event> {
	return {}
}
