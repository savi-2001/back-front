import { MongoBase } from '@regiondev/nestjs-common'
import { prop, modelOptions } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true, collection: EmailVerification.model_name } })
export class EmailVerification extends MongoBase {
	@prop({ required: true })
	public email: string

	@prop({ required: true })
	public emailToken: string

	static model_name = 'email_verification'
}
