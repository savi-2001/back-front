import { Injectable } from '@nestjs/common'
import { BaseService } from '@regiondev/nestjs-common'
import { Ticket } from './models/ticket.model'

@Injectable()
export class TicketService extends BaseService<Ticket>(Ticket) {}
