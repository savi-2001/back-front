import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator'

export enum RangeEnum {
	last_24_hours = 'last_24_hours',
	last_week = 'last_week',
	last_month = 'last_month',
	custom = 'custom',
}

export enum ShowTypeEnum {
	visitants = 'visitors',
	pages = 'pagesViews',
}

export class StatisticsDto {
	@IsEnum(RangeEnum)
	range: RangeEnum

	@IsEnum(ShowTypeEnum)
	show?: ShowTypeEnum

	@IsDateString()
	@IsOptional()
	date_from?: string

	@IsDateString()
	@IsOptional()
	date_to?: string
}

type CountType = {
	periodCount: number
	periodItems: { date: string; hour: string; count: number }[]
	pages: { path: string; count: number }[]
	referrers: { name: string; count: number }[]
	countries: { country_code: string; count: number }[]
	operatingSystem: { path: string; count: number }[]
	browsers: { name: string; count: number }[]
}

export type StatisticsResult = {
	online: number
	visitors: CountType
	pagesViews: CountType
}
