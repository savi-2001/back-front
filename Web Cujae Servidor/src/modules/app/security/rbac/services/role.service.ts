import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common'
import { BaseService, CacheService } from '@regiondev/nestjs-common'
import { Role, RoleEnum } from '../models/role.model'
import { CACHE } from '../../../shared/utils/cache.constants'
import { RoleUserService } from './roleUser.service'

@Injectable()
export class RoleService extends BaseService<Role>(Role) {
	@Inject(CacheService) private readonly cacheService: CacheService
	@Inject(RoleUserService) private readonly roleUserService: RoleUserService

	async getAllUserRoles(userId: string): Promise<string[]> {
		// const userRolesMap = this.cacheService.getObject(CACHE.USER_ROLES_MAP)
		// if (userRolesMap[userId]) {
		// 	return userRolesMap[userId]
		// } else {
		const userRoles = await this.roleUserService.model.distinct('roleName', {
			userId,
		})

		const result = await this.model.aggregate([
			{
				$match: { name: { $in: userRoles } },
			},
			{
				$graphLookup: {
					from: 'role',
					startWith: '$parentName',
					connectFromField: 'parentName',
					connectToField: 'name',
					as: 'parent_roles',
				},
			},
		])

		const allRoles = [RoleEnum.public]
		const roleMap = {}
		result.forEach((role) => {
			if (!roleMap[role.name]) {
				allRoles.push(role.name)
				roleMap[role.name] = true
			}
			role.parent_roles.forEach((parentRole) => {
				if (!roleMap[parentRole.name]) {
					allRoles.push(parentRole.name)
					roleMap[parentRole.name] = true
				}
			})
		})

		const userRolesMap = this.cacheService.getObject(CACHE.USER_ROLES_MAP)
		userRolesMap[userId] = allRoles
		this.cacheService.setObject(CACHE.USER_ROLES_MAP, userRolesMap)

		return allRoles
		// }
	}

	async isAdmin(userId: string) {
		if (!userId) return false
		const userRoles = await this.getAllUserRoles(userId)
		return userRoles.includes(RoleEnum.admin)
	}
}
