import { Inject } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { CacheService, EVENT_KEYS } from '@regiondev/nestjs-common'
import { CACHE } from '~/modules/app/shared/utils/cache.constants'
import { Role } from '../models/role.model'
import { RoleUser } from '../models/roleUser.model'

export class RolesEventListener {
	@Inject(CacheService) private cacheService: CacheService

	@OnEvent(EVENT_KEYS.actionOver(Role.model_name))
	@OnEvent(EVENT_KEYS.actionOver(RoleUser.model_name))
	handleActionOverRole_RoleUser(payload) {
		this.cacheService.del(CACHE.USER_ROLES_MAP)
	}
}
