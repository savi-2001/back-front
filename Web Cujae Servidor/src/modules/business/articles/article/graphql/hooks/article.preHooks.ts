import { PreHooksFunctions } from '@regiondev/nestjs-graphql'
import { createSlug } from '~/modules/app/shared/utils/utils'
import { ArticleService } from '../../article.service'
import { Article } from '../../models/article.model'

export function articlePreHooks(articleService: ArticleService): PreHooksFunctions<Article> {
	return {
		create<ArticleDto>(params) {
			params.input.data.slug = createSlug(params.input.data.title)
			return params.input
		},
	}
}
