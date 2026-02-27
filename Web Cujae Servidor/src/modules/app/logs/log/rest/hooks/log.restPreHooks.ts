import { PreHooksRestFunctions } from '@regiondev/nestjs-common'
import { Log } from '../../models/log.model'
import { LogService } from '../../log.service'

export function logPreHooks(logService: LogService): PreHooksRestFunctions<Log> {
	return {}
}
