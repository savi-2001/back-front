import { EventEmitter2 } from '@nestjs/event-emitter'
import { PostHooksFunctions } from '@regiondev/nestjs-graphql'
import { PageView } from '../../models/page_view.model'

export function page_viewPostHooks(eventEmitter: EventEmitter2): PostHooksFunctions<PageView> {
	return {}
}
