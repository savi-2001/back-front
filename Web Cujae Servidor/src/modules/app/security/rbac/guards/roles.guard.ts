import {
	applyDecorators,
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	NotFoundException,
	SetMetadata,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { RoleEnum } from '../models/role.model'
import { RoleService } from '../services/role.service'

type RolesType = string | string[] | RoleEnum | RoleEnum[]

@Injectable()
class RolesGuard implements CanActivate {
	@Inject(RoleService) private roleService: RoleService
	@Inject(Reflector) private reflector: Reflector

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context)
		const request = ctx.getContext()
		const id = request.user?.id

		const userRoles = await this.roleService.getAllUserRoles(id)
		let roles: RolesType = this.reflector.get('ROLES', context.getClass())
		if (!Array.isArray(roles)) {
			roles = [roles]
		}

		const can = roles.some((role) => userRoles.includes(role))

		if (!can) {
			if (process.env.NODE_ENV == 'production') {
				throw new NotFoundException('Resource not found')
			} else {
				throw new UnauthorizedException('Unauthorized')
			}
		}

		return true
	}
}

export function Roles(roles: RolesType) {
	return applyDecorators(SetMetadata('ROLES', roles), UseGuards(RolesGuard))
}
