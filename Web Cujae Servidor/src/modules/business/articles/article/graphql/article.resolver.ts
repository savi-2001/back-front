import { Resolver } from '@nestjs/graphql'
import { BaseResolver } from '@regiondev/nestjs-graphql'
import { defaultQueryOptions } from '~/modules/app/shared/utils/enabledFuncions'
import { ArticleService } from '../article.service'
import { ArticleDto } from '../models/article.dto'
import { Article } from '../models/article.model'
import { Article as ArticleType, CreateArticleInput, UpdateArticleInput } from './article.schema'
import { articleCache } from './config/article.cache'
import { articleGuards } from './config/article.guards'
import { ipRateLimit, userRateLimit } from './config/article.rateLimit'
import { ArticleHooks } from './hooks/article.hooks'

@Resolver((of) => ArticleType)
export class ArticleResolver extends BaseResolver<Article, ArticleService>({
	serviceClass: ArticleService,
	objectType: ArticleType,
	createInputClass: CreateArticleInput,
	updateInputClass: UpdateArticleInput,
	dtoClass: ArticleDto,
	hooksClass: ArticleHooks,
	guards: articleGuards,
	ipRateLimit,
	userRateLimit,
	cacheQuerys: articleCache,
	model: Article,
	enabledQuerys: defaultQueryOptions
}) {}
