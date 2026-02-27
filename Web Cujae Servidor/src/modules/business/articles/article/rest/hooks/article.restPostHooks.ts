import { EventEmitter2 } from '@nestjs/event-emitter'
import { PostHooksFunctions } from '@regiondev/nestjs-common'
import { User } from '~/modules/app/user/models/user.model'
import { Article } from '../../models/article.model'

export function articlePostHooks(eventEmitter: EventEmitter2): PostHooksFunctions<Article, User> {
	return {}
}
