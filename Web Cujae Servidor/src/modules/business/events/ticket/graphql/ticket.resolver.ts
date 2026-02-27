import { Resolver } from '@nestjs/graphql'
import { BaseResolver } from '@regiondev/nestjs-graphql'
import { TicketDto } from '../models/ticket.dto'
import { Ticket } from '../models/ticket.model'
import { TicketService } from '../ticket.service'
import { TicketHooks } from './hooks/ticket.hooks'
import { ticketCache } from './config/ticket.cache'
import { ticketGuards } from './config/ticket.guards'
import { ipRateLimit, userRateLimit } from './config/ticket.rateLimit'
import { CreateTicketInput, Ticket as TicketType, UpdateTicketInput } from './ticket.schema'
import { defaultQueryOptions } from '~/modules/app/shared/utils/enabledFuncions'

@Resolver((of) => TicketType)
export class TicketResolver extends BaseResolver<Ticket, TicketService>({
	serviceClass: TicketService,
	objectType: TicketType,
	createInputClass: CreateTicketInput,
	updateInputClass: UpdateTicketInput,
	dtoClass: TicketDto,
	hooksClass: TicketHooks,
	guards: ticketGuards,
	ipRateLimit,
	userRateLimit,
	cacheQuerys: ticketCache,
	model: Ticket,
	enabledQuerys: defaultQueryOptions
}) {}
