import { modelOptions, pre, Ref, prop, index } from '@typegoose/typegoose'
import { MongoBase, schemaOptions } from '@regiondev/nestjs-common'

@index({ uid: 1 }, { unique: true })
@modelOptions(schemaOptions(Ticket.model_name))
export class Ticket extends MongoBase {
	@prop({ required: false })
	public sender_email: string

	@prop({ required: false, trim: true })
	public sender_name: string

	@prop({ required: true, trim: true })
	public question: string

	@prop({ required: false })
	public answer: string

	@prop({
		default: () => {
			return 'Pending'
		},
		required: false,
	})
	public status: string

	// @prop({
	// 	default: () => {
	// 		return 0
	// 	},
	// 	required: false,
	// })
	// public answer_rating: number

	@prop({
		default: () => {
			return { meta: true }
		},
		required: false,
	})
	public metadata: SRecord

	@prop({ unique: true, required: true })
	public uid: string

	static model_name = 'ticket'
}
