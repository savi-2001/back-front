import { MongoBase, schemaOptions } from '@regiondev/nestjs-common'
import { index, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions(schemaOptions(ResourceGrant.model_name))
@index({ resource: 1, permission: 1, userId: 1, roleName: 1 }, { unique: true })
export class ResourceGrant extends MongoBase {
	@prop()
	public permission: string

	@prop()
	public resource: string

	@prop()
	public userId: string

	@prop()
	public roleName: string

	static model_name = 'resource_grant'
	static soft_delete = false
}
