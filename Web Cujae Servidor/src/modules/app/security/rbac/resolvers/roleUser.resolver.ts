import { Resolver } from '@nestjs/graphql'
import { BaseResolver } from '@regiondev/nestjs-graphql'
import { RoleUserDto } from '../dto/roleUser.dto'
import { AdminGuard } from '../guards/admin.guard'
import { RoleUser as RoleUserModel } from '../models/roleUser.model'
import { CreateRoleUserInput, RoleUser, UpdateRoleUserInput } from '../schemas/roleUser.schema'
import { RoleUserService } from '../services/roleUser.service'
import { RbacGuard } from '../guards/rbac.guard'
import { UseGuards } from '@nestjs/common'

@Resolver((of) => RoleUser)
@UseGuards(RbacGuard)
export class RoleUserResolver extends BaseResolver<RoleUserModel, RoleUserService>({
	objectType: RoleUser,
	createInputClass: CreateRoleUserInput,
	updateInputClass: UpdateRoleUserInput,
	serviceClass: RoleUserService,
	dtoClass: RoleUserDto,
	model: RoleUserModel,
	enabledQuerys: {
		mutationsPolicy: 'ENABLE_SPECIFIC',
		querysPolicy: 'ENABLE_SPECIFIC',
		querys: ['getMany'],
		mutations: ['create', 'deleteById', 'updateById']
	}
}) {}
