import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import {
	Article,
	ArticleService,
	ArticleEventListener,
	ArticleResolver,
	ArticleHooks,
	ArticleRestHooks,
	ArticleController,
} from './article'

@Module({
	imports: [TypegooseModule.forFeature([Article])],
	providers: [ArticleEventListener, ArticleService, ArticleResolver, ArticleHooks, ArticleRestHooks],
	controllers: [ArticleController],
	exports: [ArticleService],
})
export class ArticlesModule {}
