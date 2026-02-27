import { EventEmitter2 } from '@nestjs/event-emitter'
import { PostHooksFunctions } from '@regiondev/nestjs-graphql'
import { Log } from '../../models/log.model'

export function logPostHooks(eventEmitter: EventEmitter2): PostHooksFunctions<Log> {
	return {}
}
