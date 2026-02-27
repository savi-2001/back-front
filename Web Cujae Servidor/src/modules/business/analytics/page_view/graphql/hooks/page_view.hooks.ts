import { Injectable } from '@nestjs/common'
import { page_viewPreHooks } from './page_view.preHooks'
import { page_viewPostHooks } from './page_view.postHooks'
import { PageViewService } from '../../page_view.service'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class PageViewHooks {
	constructor(private page_viewService: PageViewService, private eventEmitter: EventEmitter2) {}

	public get preHooks() {
		return page_viewPreHooks(this.page_viewService)
	}
	public get postHooks() {
		return page_viewPostHooks(this.eventEmitter)
	}
}
