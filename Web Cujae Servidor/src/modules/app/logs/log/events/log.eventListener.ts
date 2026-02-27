import { OnEvent } from '@nestjs/event-emitter'
import { EVENT_KEYS } from '@regiondev/nestjs-common'
import { DocumentType } from '@typegoose/typegoose'
import { Log } from '../models/log.model'

export class LogEventListener {
	@OnEvent('log.postCreateHook')
	handlePostCreateHook(payload: DocumentType<Log>) {
	}

	@OnEvent(EVENT_KEYS.deleted(Log.model_name))
	handleLogDeleted(payload: DocumentType<Log>) {
	}

	@OnEvent(EVENT_KEYS.created(Log.model_name))
	handleLogCreated(payload: DocumentType<Log>) {
	}

	@OnEvent(EVENT_KEYS.updated(Log.model_name))
	handleLogUpdated(payload: DocumentType<Log>) {
	}
}
