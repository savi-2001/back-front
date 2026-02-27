import { modelOptions, prop } from '@typegoose/typegoose'
import { MongoBase } from '@regiondev/nestjs-common'

@modelOptions({ schemaOptions: { timestamps: true, collection: Traces.model_name } })
export class Traces extends MongoBase {
	@prop()
	public userId?: string

	@prop()
	public context: string

	@prop()
	public userName?: string

	@prop()
	public parentType?: string

	@prop()
	public operation: string

	@prop()
	public operationType?: string

	@prop({ required: true, default: false })
	public isDangerous?: boolean

	static model_name = 'traces'
}
