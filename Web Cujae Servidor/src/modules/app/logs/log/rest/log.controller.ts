import { Get, Param } from '@nestjs/common'
import { BaseController } from '@regiondev/nestjs-common'
import { AdminGuardRest } from '~/modules/app/security/rbac/guards/admin.guard'
import { LogService } from '../log.service'
import { LogDto } from '../models/log.dto'
import { Log } from '../models/log.model'
import { logCache } from './config/log.restCache'
import { logGuards } from './config/log.restGuards'
import { ipRateLimit, userRateLimit } from './config/log.restRateLimit'
import { LogRestHooks } from './hooks/log.restHooks'

@AdminGuardRest()
export class LogController extends BaseController<Log>({
	model: Log,
	serviceClass: LogService,
	cacheQuerys: logCache,
	dtoClass: LogDto,
	ipRateLimit: ipRateLimit,
	userRateLimit: userRateLimit,
	guards: logGuards,
	hooksClass: LogRestHooks,
	enabledEndpoints: {
		querysPolicy: 'DISABLE_ALL',
		mutationsPolicy:'DISABLE_ALL'
	}
}) {}
