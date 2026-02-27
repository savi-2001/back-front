import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	Logger,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { CacheService, RESOURCE_NAME } from '@regiondev/nestjs-common'
import { CACHE } from '@regiondev/nestjs-security'
import { ResourceGrantService } from '../services/resourceGrant.service'

@Injectable()
export class RbacGuard extends AuthGuard('jwt') implements CanActivate {
	@Inject(ResourceGrantService) private resourceGrantService: ResourceGrantService
	@Inject(Reflector) private reflector: Reflector
	@Inject(CacheService) private cacheService: CacheService

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context)
		const request = ctx.getContext()
		const headers = request?.headers

		const token = headers?.authorization || headers?.Authorization
		if (token) {
			if (await this.tokenIsInBlackList(token)) {
				return false
			}
			try {
				await super.canActivate(new ExecutionContextHost([request]))
			} catch (err) {}
		}

		const user = request.user
		const handler = ctx.getHandler().name
		const resource: string = this.reflector.get(RESOURCE_NAME, context.getClass())
		const permission = handler.slice(resource.length + 1)

		const can = await this.resourceGrantService.can(user?.id, resource, permission)

		if (!can) {
			Logger.error(`• Resource: ${resource}     • Permission: ${permission}   • User:${user}`)
			if (process.env.NODE_ENV == 'production') {
				throw new NotFoundException('Resource not found')
			} else {
				throw new UnauthorizedException('User not authorized to: ' + handler)
			}
		}
		return true
	}

	async tokenIsInBlackList(token) {
		if (token.startsWith('Bearer ')) {
			token = token.slice(7)
		}
		const blacklistMap = await this.cacheService.getObject(CACHE.JWT_BLACKLIST)
		return blacklistMap[token] ? true : false
	}
}
