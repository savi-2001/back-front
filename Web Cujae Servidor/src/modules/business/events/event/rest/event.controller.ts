import { BaseController } from '@regiondev/nestjs-common'
import { EventDto } from '../models/event.dto'
import { Event } from '../models/event.model'
import { EventService } from '../event.service'
import { eventGuards } from './config/event.restGuards'
import { ipRateLimit, userRateLimit } from './config/event.restRateLimit'
import { EventRestHooks } from './hooks/event.restHooks'
import { eventCache } from './config/event.restCache'
import { Get } from '@nestjs/common'

export class EventController extends BaseController<Event>({
	model: Event,
	serviceClass: EventService,
	cacheQuerys: eventCache,
	dtoClass: EventDto,
	ipRateLimit: ipRateLimit,
	userRateLimit: userRateLimit,
	guards: eventGuards,
	hooksClass: EventRestHooks,
	rbacGuards: true,
	enabledEndpoints: {
		querysPolicy: 'DISABLE_ALL',
		mutationsPolicy:'DISABLE_ALL'
	}
}) {
	@Get('upcoming')
	getUpcoming() {
		const date = new Date().toISOString()
		return this.service.getMany({
			pagination: { limit: 10, page: 1 },
			params: { where: { endDate: { $gt: date } }, sort: 'startDate' },
		})
	}
}
