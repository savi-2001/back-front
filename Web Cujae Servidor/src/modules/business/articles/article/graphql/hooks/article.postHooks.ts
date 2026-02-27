import { EventEmitter2 } from '@nestjs/event-emitter'
import { PostHooksFunctions } from '@regiondev/nestjs-graphql'
import { Article } from '../../models/article.model'

export function articlePostHooks(eventEmitter: EventEmitter2): PostHooksFunctions<Article> {
	return {}
}
