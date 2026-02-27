import { PreHooksRestFunctions } from '@regiondev/nestjs-common'
import { Ticket } from '../../models/ticket.model'
import { TicketService } from '../../ticket.service'
import { Logger } from '@nestjs/common'

export function ticketPreHooks(ticketService: TicketService): PreHooksRestFunctions<Ticket> {
	return {
		async create(params) {
			let exists = true
			let uid = ''
			do {
				uid = String(Math.floor(1000000000 + Math.random() * 900000))
				exists = await ticketService.exists({ uid })
			} while (exists === true)

			params.input.data.uid = uid
			return params.input
		},
		getOne(params) {
			return params.input
		},
	}
}
