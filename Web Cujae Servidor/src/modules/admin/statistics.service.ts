import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { getDatesForRange } from '../app/shared/utils/utils'
import { PageViewService } from '../business/analytics/page_view'
import { browsers, countries, operatingSystem, pages, unique_ips, unique_ips_by_hour } from './aggregations'
import { pages_views, pages_views_browsers, pages_views_by_hour, pages_views_countries, pages_views_os, pages_views_pages } from './pageViewsAggregations'
import { RangeEnum, StatisticsDto, StatisticsResult } from './types'

@Injectable()
export class StatisticsService implements OnModuleInit {
	constructor(private pageViewService: PageViewService) {}

	async onModuleInit() {
		// Logger.verbose(await this.getStatistics({ range: RangeEnum.last_24_hours }))
	}

	async getStatistics(params: StatisticsDto) {
		const [visitors, pagesViews] = await Promise.all([
			this.getVisitsStatitics(params),
			this.getPagesViewsStatitics(params)
		])

		const timeMinus5Minutes = new Date(new Date().getTime() - 5 * 60 * 1000);

		const result = await this.pageViewService.model.aggregate([
			{ $match: { createdAt: { $gte: timeMinus5Minutes } } },
			{ $group: { _id: '$ip', }, }, { $count: 'online', },
		])

		return { ...visitors, ...pagesViews, online: result[0]?.online || 0 }
	}

	async getVisitsStatitics(params: StatisticsDto): Promise<StatisticsResult> {
		let date_from = new Date(params.date_from)
		let date_to = new Date(params.date_to)
		const { range } = params

		if (range !== RangeEnum.custom) {
			const dates = getDatesForRange(range)
			date_from = dates.date_from
			date_to = dates.date_to
		} else if (range === RangeEnum.custom) {
			date_to = new Date(new Date(date_to).setDate(new Date(date_to).getDate() + 1))
		}

		const result = await this.pageViewService.model.aggregate([
			{ $match: { createdAt: { $gte: date_from, $lte: date_to } } },
			{
				$facet: {
					unique_ips: unique_ips as any,
					countries: countries as any,
					unique_ips_by_hour: unique_ips_by_hour as any,
					browsers: browsers as any,
					operatingSystem: operatingSystem as any,
					pages: pages as any,
				},
			},
		])

		const res = this.mapResult(result)

		return res
	}

	mapResult(result) {
		const [{ unique_ips, pages, countries, unique_ips_by_hour, operatingSystem, browsers }] = result

		return {
			visitors: {
				periodCount: unique_ips?.[0]?.unique_ips ?? 0,
				periodItems: unique_ips_by_hour,
				browsers,
				countries,
				operatingSystem,
				pages,
			},
		} as StatisticsResult
	}


	async getPagesViewsStatitics(params: StatisticsDto): Promise<StatisticsResult> {
		let date_from = new Date(params.date_from)
		let date_to = new Date(params.date_to)
		const { range } = params

		if (range !== RangeEnum.custom) {
			const dates = getDatesForRange(range)
			date_from = dates.date_from
			date_to = dates.date_to
		} else if (range === RangeEnum.custom) {
			date_to = new Date(new Date(date_to).setDate(new Date(date_to).getDate() + 1))
		}

		const result = await this.pageViewService.model.aggregate([
			{ $match: { createdAt: { $gte: date_from, $lte: date_to } } },
			{
				$facet: {
					pages_views: pages_views as any,
					pages_views_by_hour: pages_views_by_hour as any,
					pages_views_countries: pages_views_countries as any,
					browsers: pages_views_browsers as any,
					operatingSystem: pages_views_os as any,
					pages: pages_views_pages as any,
				},
			},
		])

		const res = this.mapPagesViewResult(result)

		return res as any
	}

	mapPagesViewResult(result) {
		const [{ pages_views, pages_views_by_hour, pages_views_countries, browsers, operatingSystem, pages }] = result

		return {
			pagesViews: {
				periodCount: pages_views?.[0]?.pages_views ?? 0,
				periodItems: pages_views_by_hour,
				browsers,
				countries: pages_views_countries,
				operatingSystem,
				pages,
			},
		} as StatisticsResult
	}
}
