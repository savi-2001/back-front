import { modelOptions, pre, Ref, prop, index } from '@typegoose/typegoose'
import { MongoBase, schemaOptions } from '@regiondev/nestjs-common'

@modelOptions(schemaOptions(Log.model_name))
export class Log extends MongoBase {
	@prop({ required: false })
	public host: string

	@prop({ required: false })
	public remote_addr: string

	@prop({})
	public time_local: string

	@prop({})
	public method: string

	@prop({})
	public path: string

	@prop({})
	public protocol: string

	@prop({})
	public status: number

	@prop({})
	public body_bytes_sent: number

	@prop({})
	public http_referer: string

	@prop({})
	public http_user_agent: string

	@prop({})
	public http_x_forwarded_for: string

	@prop({})
	public browser: string

	@prop({})
	public os: string

	@prop({})
	public country_code: string

	@prop({})
	public metadata: SRecord

	static model_name = 'log'
}
