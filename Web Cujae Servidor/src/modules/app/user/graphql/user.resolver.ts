import { Inject, Logger, UseGuards } from '@nestjs/common'
import { Parent, registerEnumType, ResolveField, Resolver } from '@nestjs/graphql'
import { BaseResolver } from '@regiondev/nestjs-graphql'
import { RoleService } from '../../security/rbac/services/role.service'
import { UserDto } from '../models/user.dto'
import { UserService } from '../user.service'
import { CreateUserInput, UpdateUserInput, User } from './user.schema'
import { User as UserModel, AccountStatusEnum } from '../models/user.model'
import { RbacGuard } from '../../security/rbac/guards/rbac.guard'
import { UserHooks } from './hooks/user.hooks'

@Resolver((of) => User)
@UseGuards(RbacGuard)
export class UserResolver extends BaseResolver<UserModel, RoleService>({
	objectType: User,
	createInputClass: CreateUserInput,
	updateInputClass: UpdateUserInput,
	serviceClass: UserService,
	dtoClass: UserDto,
	model: UserModel,
	hooksClass: UserHooks,
	enabledQuerys: {
		mutationsPolicy: 'ENABLE_SPECIFIC',
		querysPolicy: 'ENABLE_SPECIFIC',
		querys: ['exists', 'getMany'],
		mutations: ['create', 'deleteById', 'updateById']
	}
}) {
	@Inject(RoleService) RoleService: RoleService

	@ResolveField((returns) => [String])
	async roles(@Parent() user: User) {
		const roles = await this.RoleService.getAllUserRoles(user.id)
		return roles
	}
}

registerEnumType(AccountStatusEnum, { name: 'AccountStatus' })
