import { BaseController } from '@regiondev/nestjs-common'
import { PageViewDto } from '../models/page_view.dto'
import { PageView } from '../models/page_view.model'
import { PageViewService } from '../page_view.service'
import { page_viewCache } from './config/page_view.restCache'
import { page_viewGuards } from './config/page_view.restGuards'
import { ipRateLimit, userRateLimit } from './config/page_view.restRateLimit'
import { PageViewRestHooks } from './hooks/page_view.restHooks'
import { Body, Get, Param, Post } from '@nestjs/common'

export class PageViewController extends BaseController<PageView>({
	model: PageView,
	serviceClass: PageViewService,
	cacheQuerys: page_viewCache,
	dtoClass: PageViewDto,
	ipRateLimit: ipRateLimit,
	userRateLimit: userRateLimit,
	guards: page_viewGuards,
	hooksClass: PageViewRestHooks,
	enabledEndpoints: {
		querysPolicy: 'DISABLE_ALL',
		mutationsPolicy: 'ENABLE_SPECIFIC',
		mutations:['create']
	}
}) {
	@Post('views')
	pagesViewByPath(@Body('path') path) {
		return (this.service as PageViewService).pagesViewByPath(path)
	}
}
