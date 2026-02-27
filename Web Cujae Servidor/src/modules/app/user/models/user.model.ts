import { modelOptions, pre, Ref, prop, index } from '@typegoose/typegoose'
import { MongoBase, schemaOptions } from '@regiondev/nestjs-common'

@modelOptions(schemaOptions(User.model_name))
export class User extends MongoBase {
	@prop({ required: false })
	public passwordHash: string

	@prop({ unique: true, required: true })
	public email: string

	@prop({ required: true })
	public name: string

	@prop({
		default: () => {
			return 'Awaiting'
		},
	})
	public accountStatus: AccountStatusEnum

	@prop({ required: false })
	public meta: SRecord

	static model_name = 'user'
}

export enum AccountStatusEnum {
	Active = 'Active',
	Awaiting = 'Awaiting',
	Suspended = 'Suspended',
}
