import { MongoBase } from '@regiondev/nestjs-common'
import { modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true, collection: ForgottenPassword.model_name } })
export class ForgottenPassword extends MongoBase {
	@prop({ required: true })
	public email: string

	@prop({ required: true })
	public passwordToken: string

	static model_name = 'forgotten_password'
}
