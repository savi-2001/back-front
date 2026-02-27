import { OnEvent } from '@nestjs/event-emitter'
import { EVENT_KEYS } from '@regiondev/nestjs-common'
import { DocumentType } from '@typegoose/typegoose'
import { PageView } from '../models/page_view.model'

export class PageViewEventListener {
	@OnEvent('page_view.postCreateHook')
	handlePostCreateHook(payload: DocumentType<PageView>) {
	}

	@OnEvent(EVENT_KEYS.deleted(PageView.model_name))
	handlePageViewDeleted(payload: DocumentType<PageView>) {
	}

	@OnEvent(EVENT_KEYS.created(PageView.model_name))
	handlePageViewCreated(payload: DocumentType<PageView>) {
	}

	@OnEvent(EVENT_KEYS.updated(PageView.model_name))
	handlePageViewUpdated(payload: DocumentType<PageView>) {
	}
}
