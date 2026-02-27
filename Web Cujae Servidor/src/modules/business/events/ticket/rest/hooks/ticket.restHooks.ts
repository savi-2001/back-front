import { Injectable } from '@nestjs/common'
import { ticketPreHooks } from './ticket.restPreHooks'
import { ticketPostHooks } from './ticket.restPostHooks'
import { TicketService } from '../../ticket.service'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class TicketRestHooks {
	constructor(private ticketService: TicketService, private eventEmitter: EventEmitter2) {}

	public get preHooks() {
		return ticketPreHooks(this.ticketService)
	}
	public get postHooks() {
		return ticketPostHooks(this.eventEmitter)
	}
}
