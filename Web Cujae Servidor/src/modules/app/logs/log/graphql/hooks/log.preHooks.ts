import { PreHooksFunctions } from '@regiondev/nestjs-graphql'
import { LogService } from '../../log.service'
import { Log } from '../../models/log.model'
import { SoftDelete } from '@regiondev/nestjs-common'

export function logPreHooks(logService: LogService): PreHooksFunctions<Log> {
	return {
		getMany(params) {
			params.input.softDelete = SoftDelete.All
			return params.input
		},
	}
}
