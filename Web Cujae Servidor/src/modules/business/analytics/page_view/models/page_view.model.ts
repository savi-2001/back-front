import { modelOptions, pre, Ref, prop, index } from '@typegoose/typegoose'
import { MongoBase, schemaOptions } from '@regiondev/nestjs-common'

@modelOptions(schemaOptions(PageView.model_name))
export class PageView extends MongoBase {
	@prop({})
	public path: string

	@prop({})
	public ip: string

	@prop({})
	public referer: string

	@prop({})
	public os: string

	@prop({})
	public browser: string

	@prop({})
	public country_code: string

	@prop({})
	public http_user_agent: string

	static model_name = 'page_view'
}
