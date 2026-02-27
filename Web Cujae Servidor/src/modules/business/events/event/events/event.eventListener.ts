import { OnEvent } from '@nestjs/event-emitter'
import { EVENT_KEYS } from '@regiondev/nestjs-common'
import { DocumentType } from '@typegoose/typegoose'
import { Event } from '../models/event.model'

export class EventEventListener {
	@OnEvent('event.postCreateHook')
	handlePostCreateHook(payload: DocumentType<Event>) {
	}

	@OnEvent(EVENT_KEYS.deleted(Event.model_name))
	handleEventDeleted(payload: DocumentType<Event>) {
	}

	@OnEvent(EVENT_KEYS.created(Event.model_name))
	handleEventCreated(payload: DocumentType<Event>) {
	}

	@OnEvent(EVENT_KEYS.updated(Event.model_name))
	handleEventUpdated(payload: DocumentType<Event>) {
	}
}
