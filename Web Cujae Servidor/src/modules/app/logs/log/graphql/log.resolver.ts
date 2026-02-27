import { UseGuards } from '@nestjs/common'
import { Resolver } from '@nestjs/graphql'
import { BaseResolver } from '@regiondev/nestjs-graphql'
import { RbacGuard } from '~/modules/app/security/rbac/guards/rbac.guard'
import { LogService } from '../log.service'
import { LogDto } from '../models/log.dto'
import { Log } from '../models/log.model'
import { logCache } from './config/log.cache'
import { logGuards } from './config/log.guards'
import { ipRateLimit, userRateLimit } from './config/log.rateLimit'
import { LogHooks } from './hooks/log.hooks'
import { CreateLogInput, Log as LogType, UpdateLogInput } from './log.schema'

@Resolver((of) => LogType)
@UseGuards(RbacGuard)
export class LogResolver extends BaseResolver<Log, LogService>({
	serviceClass: LogService,
	objectType: LogType,
	createInputClass: CreateLogInput,
	updateInputClass: UpdateLogInput,
	dtoClass: LogDto,
	hooksClass: LogHooks,
	guards: logGuards,
	ipRateLimit,
	userRateLimit,
	cacheQuerys: logCache,
	model: Log,
	enabledQuerys: {
		mutationsPolicy: 'DISABLE_ALL',
		querysPolicy: 'ENABLE_ALL',
	}
}) {}
