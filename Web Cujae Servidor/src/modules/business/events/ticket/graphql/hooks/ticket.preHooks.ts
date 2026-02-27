import { PreHooksFunctions } from '@regiondev/nestjs-graphql'
import { Ticket } from '../../models/ticket.model'
import { TicketService } from '../../ticket.service'

export function ticketPreHooks(ticketService: TicketService): PreHooksFunctions<Ticket> {
	return {}
}
