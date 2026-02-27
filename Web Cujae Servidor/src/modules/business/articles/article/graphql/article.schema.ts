import { Field, ID, InputType, ObjectType, PartialType } from '@nestjs/graphql'
import { BaseType, Json } from '@regiondev/nestjs-graphql'

@InputType()
export class CreateArticleInput {
	@Field()
	title: string
	images?: string[]
	datePublished: Date
	dateModified?: Date

	@Field((type) => Json, { nullable: true })
	author?: SRecord
	articleBody: string
	summary?: string
}

@InputType()
export class UpdateArticleInput extends PartialType(CreateArticleInput) {
	id?: string
}

@ObjectType()
export class Article extends BaseType {
	@Field()
	title: string
	images?: string[]
	datePublished: Date
	dateModified?: Date

	@Field((type) => Json, { nullable: true })
	author?: SRecord
	articleBody: string
	summary?: string
}
