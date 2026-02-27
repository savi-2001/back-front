import { Injectable } from '@nestjs/common'
import { articlePreHooks } from './article.preHooks'
import { articlePostHooks } from './article.postHooks'
import { ArticleService } from '../../article.service'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class ArticleHooks {
	constructor(private articleService: ArticleService, private eventEmitter: EventEmitter2) {}

	public get preHooks() {
		return articlePreHooks(this.articleService)
	}
	public get postHooks() {
		return articlePostHooks(this.eventEmitter)
	}
}
