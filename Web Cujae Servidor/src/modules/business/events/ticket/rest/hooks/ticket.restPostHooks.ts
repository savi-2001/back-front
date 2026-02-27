import { EventEmitter2 } from '@nestjs/event-emitter'
import { PostHooksFunctions } from '@regiondev/nestjs-common'
import { User } from '~/modules/app/user/models/user.model'
import { Ticket } from '../../models/ticket.model'

export function ticketPostHooks(eventEmitter: EventEmitter2): PostHooksFunctions<Ticket, User> {
	return {}
}
