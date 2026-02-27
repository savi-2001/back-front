import { Module } from '@nestjs/common'
import { ArticlesModule } from './modules/business/articles/articles.module'
import { EventsModule } from './modules/business/events/events.module'
import { AnalyticsModule } from './modules/business/analytics/analytics.module'

@Module({
	imports: [ArticlesModule, EventsModule, AnalyticsModule],
	controllers: [],
	providers: [],
})
export class AllBusinessModule {}
