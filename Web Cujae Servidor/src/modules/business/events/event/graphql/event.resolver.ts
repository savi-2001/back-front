import { Resolver } from '@nestjs/graphql'
import { BaseResolver } from '@regiondev/nestjs-graphql'
import { EventDto } from '../models/event.dto'
import { Event } from '../models/event.model'
import { EventService } from '../event.service'
import { EventHooks } from './hooks/event.hooks'
import { eventCache } from './config/event.cache'
import { eventGuards } from './config/event.guards'
import { ipRateLimit, userRateLimit } from './config/event.rateLimit'
import { CreateEventInput, Event as EventType, UpdateEventInput } from './event.schema'
import { defaultQueryOptions } from '~/modules/app/shared/utils/enabledFuncions'

@Resolver((of) => EventType)
export class EventResolver extends BaseResolver<Event, EventService>({
	serviceClass: EventService,
	objectType: EventType,
	createInputClass: CreateEventInput,
	updateInputClass: UpdateEventInput,
	dtoClass: EventDto,
	hooksClass: EventHooks,
	guards: eventGuards,
	ipRateLimit,
	userRateLimit,
	cacheQuerys: eventCache,
	model: Event,
	enabledQuerys: defaultQueryOptions
}) {}
