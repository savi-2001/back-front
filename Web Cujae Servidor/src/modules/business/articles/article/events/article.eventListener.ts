import { OnEvent } from '@nestjs/event-emitter'
import { DocumentType } from '@typegoose/typegoose'
import { Article } from '../models/article.model'
import { Logger } from '@nestjs/common'
import { EVENT_KEYS } from '@regiondev/nestjs-common'

export class ArticleEventListener {
	@OnEvent('article.postCreateHook')
	handlePostCreateHook(payload: DocumentType<Article>) {
	}

	@OnEvent(EVENT_KEYS.deleted(Article.model_name))
	handleArticleDeleted(payload: DocumentType<Article>) {
	}

	@OnEvent(EVENT_KEYS.created(Article.model_name))
	handleArticleCreated(payload: DocumentType<Article>) {
	}

	@OnEvent(EVENT_KEYS.updated(Article.model_name))
	handleArticleUpdated(payload: DocumentType<Article>) {
	}
}
