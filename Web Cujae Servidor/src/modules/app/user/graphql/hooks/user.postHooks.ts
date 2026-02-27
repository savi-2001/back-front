import { EventEmitter2 } from '@nestjs/event-emitter'
import { PostHooksFunctions } from '@regiondev/nestjs-graphql'
import { User } from '../../models/user.model'
import { UserService } from '../../user.service'

export function userPostHooks(
	userService: UserService,
	eventEmitter: EventEmitter2,
): PostHooksFunctions<User> {
	return {
		create(params) {
			const { element, input } = params
			const data = { ...element.toJSON(), meta: { password: (input.data as any).password } }
			return data as any
		},
	}
}
