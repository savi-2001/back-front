import { Injectable } from '@nestjs/common'
import { page_viewPreHooks } from './page_view.restPreHooks'
import { page_viewPostHooks } from './page_view.restPostHooks'
import { PageViewService } from '../../page_view.service'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class PageViewRestHooks {
	constructor(private page_viewService: PageViewService, private eventEmitter: EventEmitter2) {}

	public get preHooks() {
		return page_viewPreHooks(this.page_viewService)
	}
	public get postHooks() {
		return page_viewPostHooks(this.eventEmitter)
	}
}
