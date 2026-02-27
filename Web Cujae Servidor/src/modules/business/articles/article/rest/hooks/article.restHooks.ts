import { Injectable } from '@nestjs/common'
import { articlePreHooks } from './article.restPreHooks'
import { articlePostHooks } from './article.restPostHooks'
import { ArticleService } from '../../article.service'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class ArticleRestHooks {
	constructor(private articleService: ArticleService, private eventEmitter: EventEmitter2) {}

	public get preHooks() {
		return articlePreHooks(this.articleService)
	}
	public get postHooks() {
		return articlePostHooks(this.eventEmitter)
	}
}
