import { modelOptions, pre, Ref, prop, index } from '@typegoose/typegoose'
import { MongoBase, schemaOptions } from '@regiondev/nestjs-common'

@modelOptions({ schemaOptions: { collection: 'ip_country' } })
export class IpCountry extends MongoBase {
	@prop({})
	public range_start: string

	@prop({})
	public range_end: string

	@prop({})
	public country_code: string

	@prop({})
	public range_start_number: number

	@prop({})
	public range_end_number: number
}
