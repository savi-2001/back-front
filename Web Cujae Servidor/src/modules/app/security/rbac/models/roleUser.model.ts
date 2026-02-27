import { index, modelOptions, prop } from '@typegoose/typegoose'
import { MongoBase, schemaOptions } from '@regiondev/nestjs-common'

@modelOptions(schemaOptions(RoleUser.model_name))
@index({ userId: 1, roleName: 1 }, { unique: true })
export class RoleUser extends MongoBase {
	@prop()
	public userId: string

	@prop()
	public roleName: string

	static model_name = 'role_user'
	static soft_delete = false
}
