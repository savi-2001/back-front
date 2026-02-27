import { BaseController } from '@regiondev/nestjs-common'
import { ArticleService } from '../article.service'
import { ArticleDto } from '../models/article.dto'
import { Article } from '../models/article.model'
import { articleCache } from './config/article.restCache'
import { articleGuards } from './config/article.restGuards'
import { ipRateLimit, userRateLimit } from './config/article.restRateLimit'
import { ArticleRestHooks } from './hooks/article.restHooks'

export class ArticleController extends BaseController<Article>({
	model: Article,
	serviceClass: ArticleService,
	cacheQuerys: articleCache,
	dtoClass: ArticleDto,
	ipRateLimit: ipRateLimit,
	userRateLimit: userRateLimit,
	guards: articleGuards,
	hooksClass: ArticleRestHooks,
	rbacGuards: true,
	enabledEndpoints: {
		querysPolicy: 'ENABLE_SPECIFIC',
		querys: ['getOne', 'getById', 'getMany'],
		mutationsPolicy:'DISABLE_ALL'
	}
}) {}
