import { modelOptions, pre, Ref, prop, index } from '@typegoose/typegoose'
import { MongoBase, schemaOptions } from '@regiondev/nestjs-common'

@modelOptions(schemaOptions(Article.model_name))
export class Article extends MongoBase {
	@prop({ required: true, trim: true })
	public title: string

	@prop({ required: false })
	public images: string[]

	@prop({
		default: () => {
			return 'date_now'
		},
		required: true,
	})
	public datePublished: Date

	@prop({ required: false })
	public dateModified: Date

	@prop({ required: false })
	public author: SRecord

	@prop({ required: true })
	public articleBody: string

	@prop({ required: false })
	public summary: string

	@prop({ required: false })
	public slug: string

	static model_name = 'article'
}
