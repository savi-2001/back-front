import { EventEmitter2 } from '@nestjs/event-emitter'
import { PostHooksFunctions } from '@regiondev/nestjs-common'
import { User } from '~/modules/app/user/models/user.model'
import { Event } from '../../models/event.model'

export function eventPostHooks(eventEmitter: EventEmitter2): PostHooksFunctions<Event, User> {
	return {}
}
