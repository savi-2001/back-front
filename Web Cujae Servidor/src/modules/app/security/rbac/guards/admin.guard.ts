import {
	applyDecorators,
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	NotFoundException,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { GqlAuthGuard, RestGuard } from '@regiondev/nestjs-security'
import { RoleService } from '../services/role.service'

@Injectable()
class IsAdminGuard implements CanActivate {
	@Inject(RoleService) private roleService: RoleService

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context)
		const request = ctx.getContext()
		const id = request.user?.id

		const isAdmin = await this.roleService.isAdmin(id)

		if (!isAdmin) {
			if (process.env.NODE_ENV == 'production') {
				throw new NotFoundException('Resource not found')
			} else {
				throw new UnauthorizedException('Unauthorized')
			}
		}

		return true
	}
}

@Injectable()
class IsAdminRestGuard implements CanActivate {
	@Inject(RoleService) private roleService: RoleService

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		const id = request.user?.id

		const isAdmin = await this.roleService.isAdmin(id)

		if (!isAdmin) {
			if (process.env.NODE_ENV == 'production') {
				throw new NotFoundException('Resource not found')
			} else {
				throw new UnauthorizedException('Unauthorized')
			}
		}

		return true
	}
}

export function AdminGuard() {
	return applyDecorators(UseGuards(GqlAuthGuard, IsAdminGuard))
}

export function AdminGuardRest() {
	return applyDecorators(UseGuards(RestGuard, IsAdminRestGuard))
}
