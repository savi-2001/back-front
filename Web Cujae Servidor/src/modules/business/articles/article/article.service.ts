import { Injectable } from '@nestjs/common'
import { BaseService } from '@regiondev/nestjs-common'
import { Article } from './models/article.model'

@Injectable()
export class ArticleService extends BaseService<Article>(Article) {
}
