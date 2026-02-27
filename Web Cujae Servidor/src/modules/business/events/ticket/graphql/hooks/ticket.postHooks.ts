import { EventEmitter2 } from '@nestjs/event-emitter'
import { PostHooksFunctions } from '@regiondev/nestjs-graphql'
import { Ticket } from '../../models/ticket.model'

export function ticketPostHooks(eventEmitter: EventEmitter2): PostHooksFunctions<Ticket> {
	return {}
}
