import { Resolver } from '@nestjs/graphql'
import { BaseResolver } from '@regiondev/nestjs-graphql'
import { PageViewDto } from '../models/page_view.dto'
import { PageView } from '../models/page_view.model'
import { PageViewService } from '../page_view.service'
import { page_viewCache } from './config/page_view.cache'
import { page_viewGuards } from './config/page_view.guards'
import { ipRateLimit, userRateLimit } from './config/page_view.rateLimit'
import { PageViewHooks } from './hooks/page_view.hooks'
import { CreatePageViewInput, PageView as PageViewType, UpdatePageViewInput } from './page_view.schema'

@Resolver((of) => PageViewType)
export class PageViewResolver extends BaseResolver<PageView, PageViewService>({
	serviceClass: PageViewService,
	objectType: PageViewType,
	createInputClass: CreatePageViewInput,
	updateInputClass: UpdatePageViewInput,
	dtoClass: PageViewDto,
	hooksClass: PageViewHooks,
	guards: page_viewGuards,
	ipRateLimit,
	userRateLimit,
	cacheQuerys: page_viewCache,
	model: PageView,
	enabledQuerys: {
		mutationsPolicy: 'DISABLE_ALL',
		querysPolicy:'DISABLE_ALL'
	}
}) {}
