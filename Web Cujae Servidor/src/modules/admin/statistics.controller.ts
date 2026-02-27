import { Controller, Get, Query } from '@nestjs/common'
import { StatisticsService } from './statistics.service'
import { StatisticsDto, StatisticsResult } from './types'

@Controller('statistics')
export class StatisticsController {
	constructor(private statisticsService: StatisticsService) {}

	@Get('visits')
	getStatistics(@Query() params: StatisticsDto): Promise<StatisticsResult> {
		return this.statisticsService.getStatistics(params)
	}
}
