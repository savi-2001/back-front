import { ALWAYS, BaseDto } from '@regiondev/nestjs-common'
import { IsArray, IsDate, IsObject, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { Article } from './article.model'

export class ArticleDto extends BaseDto<Article> {
	@IsString(ALWAYS)
	@MinLength(10, ALWAYS)
	@MaxLength(200, ALWAYS)
	@IsOptional(ALWAYS)
	title: string

	@IsString({ ...ALWAYS, each: true })
	@IsOptional(ALWAYS)
	@IsArray(ALWAYS)
	images: string[]

	@IsDate(ALWAYS)
	@IsOptional(ALWAYS)
	datePublished: Date

	@IsDate(ALWAYS)
	@IsOptional(ALWAYS)
	dateModified: Date

	@IsObject(ALWAYS)
	@IsOptional(ALWAYS)
	author: SRecord

	@IsString(ALWAYS)
	@IsOptional(ALWAYS)
	articleBody: string

	@IsString(ALWAYS)
	@IsOptional(ALWAYS)
	summary: string

	@IsString(ALWAYS)
	@IsOptional(ALWAYS)
	slug: string
}
