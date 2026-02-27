import { Injectable, Inject, Logger } from '@nestjs/common'
import { BaseService } from '@regiondev/nestjs-common'
import { ResourceGrant } from '../models/resourceGrant.model'
import { RoleService } from './role.service'
import { RoleEnum } from '../models/role.model'

@Injectable()
export class ResourceGrantService extends BaseService<ResourceGrant>(ResourceGrant) {
	@Inject(RoleService) private roleService: RoleService

	async can(userId: string, resource: string, permission: string) {
		let userRoles = []

		if (!userId) {
			userRoles = [RoleEnum.public]
		} else {
			userRoles = await this.roleService.getAllUserRoles(userId)
		}

		const can = await this.exists({
			$and: [
				{ $or: [{ roleName: { $in: userRoles } }, { userId: { $exists: true, $eq: userId } }] },
				{
					$or: [
						{ resource, $or: [{ permission }, { permission: '*' }] },
						{ resource: '*', $or: [{ permission }, { permission: '*' }] },
					],
				},
			],
		})

		return can
	}
}
