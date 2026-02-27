import { Resolver } from '@nestjs/graphql'
import { BaseResolver } from '@regiondev/nestjs-graphql'
import { RoleDto } from '../dto/role.dto'
import { AdminGuard } from '../guards/admin.guard'
import { Role as RoleModel } from '../models/role.model'
import { CreateRoleInput, Role, UpdateRoleInput } from '../schemas/role.schema'
import { RoleService } from '../services/role.service'
import { UseGuards } from '@nestjs/common'
import { RbacGuard } from '../guards/rbac.guard'

@Resolver((of) => Role)
@UseGuards(RbacGuard)
export class RoleResolver extends BaseResolver<RoleModel, RoleService>({
	objectType: Role,
	createInputClass: CreateRoleInput,
	updateInputClass: UpdateRoleInput,
	serviceClass: RoleService,
	dtoClass: RoleDto,
	model: RoleModel,
	enabledQuerys: {
		mutationsPolicy: 'ENABLE_SPECIFIC',
		querysPolicy: 'ENABLE_SPECIFIC',
		querys: ['getMany'],
		mutations: ['create', 'deleteById', 'updateById']
	}
}) {}
