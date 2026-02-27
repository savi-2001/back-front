import { modelOptions, prop, index } from '@typegoose/typegoose'
import { MongoBase, schemaOptions } from '@regiondev/nestjs-common'

@modelOptions(schemaOptions(Role.model_name))
@index({ name: 1, parentName: 1 }, { unique: true })
export class Role extends MongoBase {
	@prop()
	public name: string

	@prop()
	public parentName: string

	static model_name = 'role'
	static soft_delete = false
}

// These 3 roles are always static.
export enum RoleEnum {
	auth = 'auth',
	public = 'public',
	admin = 'admin',
}
