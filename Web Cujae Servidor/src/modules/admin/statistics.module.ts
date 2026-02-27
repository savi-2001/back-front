import { Module } from '@nestjs/common'
import { LogsModule } from '../app/logs/logs.module'
import { StatisticsController } from './statistics.controller'
import { StatisticsService } from './statistics.service'
import { AnalyticsModule } from '../business/analytics/analytics.module'

@Module({
	imports: [LogsModule, AnalyticsModule],
	controllers: [StatisticsController],
	providers: [StatisticsService],
})
export class StatisticsModule {}
