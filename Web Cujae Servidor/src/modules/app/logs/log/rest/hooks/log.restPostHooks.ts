import { EventEmitter2 } from '@nestjs/event-emitter'
import { PostHooksFunctions } from '@regiondev/nestjs-common'
import { User } from '~/modules/app/user/models/user.model'
import { Log } from '../../models/log.model'

export function logPostHooks(eventEmitter: EventEmitter2): PostHooksFunctions<Log, User> {
	return {}
}
