import { PreHooksRestFunctions } from '@regiondev/nestjs-common'
import { Article } from '../../models/article.model'
import { ArticleService } from '../../article.service'

export function articlePreHooks(articleService: ArticleService): PreHooksRestFunctions<Article> {
	return {}
}
