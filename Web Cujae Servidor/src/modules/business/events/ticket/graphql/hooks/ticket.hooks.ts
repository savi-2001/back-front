import { Injectable } from '@nestjs/common'
import { ticketPreHooks } from './ticket.preHooks'
import { ticketPostHooks } from './ticket.postHooks'
import { TicketService } from '../../ticket.service'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class TicketHooks {
	constructor(private ticketService: TicketService, private eventEmitter: EventEmitter2) {}

	public get preHooks() {
		return ticketPreHooks(this.ticketService)
	}
	public get postHooks() {
		return ticketPostHooks(this.eventEmitter)
	}
}
