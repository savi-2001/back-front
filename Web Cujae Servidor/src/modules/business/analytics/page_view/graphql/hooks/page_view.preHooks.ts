import { PreHooksFunctions } from '@regiondev/nestjs-graphql'
import { PageView } from '../../models/page_view.model'
import { PageViewService } from '../../page_view.service'

export function page_viewPreHooks(page_viewService: PageViewService): PreHooksFunctions<PageView> {
	return {}
}
