import { OnEvent } from '@nestjs/event-emitter'
import { EVENT_KEYS } from '@regiondev/nestjs-common'
import { DocumentType } from '@typegoose/typegoose'
import { Ticket } from '../models/ticket.model'

export class TicketEventListener {
	@OnEvent('ticket.postCreateHook')
	handlePostCreateHook(payload: DocumentType<Ticket>) {}

	@OnEvent(EVENT_KEYS.deleted(Ticket.model_name))
	handleTicketDeleted(payload: DocumentType<Ticket>) {}

	@OnEvent(EVENT_KEYS.created(Ticket.model_name))
	handleTicketCreated(payload: DocumentType<Ticket>) {}

	@OnEvent(EVENT_KEYS.updated(Ticket.model_name))
	handleTicketUpdated(payload: DocumentType<Ticket>) {}
}
