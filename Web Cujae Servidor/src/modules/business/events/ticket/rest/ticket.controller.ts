import { BaseController } from '@regiondev/nestjs-common'
import { TicketDto } from '../models/ticket.dto'
import { Ticket } from '../models/ticket.model'
import { TicketService } from '../ticket.service'
import { ticketGuards } from './config/ticket.restGuards'
import { ipRateLimit, userRateLimit } from './config/ticket.restRateLimit'
import { TicketRestHooks } from './hooks/ticket.restHooks'
import { ticketCache } from './config/ticket.restCache'

export class TicketController extends BaseController<Ticket>({
	model: Ticket,
	serviceClass: TicketService,
	cacheQuerys: ticketCache,
	dtoClass: TicketDto,
	ipRateLimit: ipRateLimit,
	userRateLimit: userRateLimit,
	guards: ticketGuards,
	hooksClass: TicketRestHooks,
	rbacGuards: true,
	enabledEndpoints: {
		querysPolicy: 'ENABLE_SPECIFIC',
		querys: ['getOne'],
		mutationsPolicy: 'ENABLE_SPECIFIC',
		mutations:['create']
	}
}) {}
