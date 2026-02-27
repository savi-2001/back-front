import { Resolver } from '@nestjs/graphql'
import { BaseResolver } from '@regiondev/nestjs-graphql'
import { ResourceGrantDto } from '../dto/resourceGrant.dto'
import { AdminGuard } from '../guards/admin.guard'
import { ResourceGrant as ResourceGrantModel } from '../models/resourceGrant.model'
import {
	CreateResourceGrantInput,
	ResourceGrant,
	UpdateResourceGrantInput,
} from '../schemas/resourceGrant.schema'
import { ResourceGrantService } from '../services/resourceGrant.service'
import { UseGuards } from '@nestjs/common'
import { RbacGuard } from '../guards/rbac.guard'

@Resolver((of) => ResourceGrant)
@UseGuards(RbacGuard)
export class ResourceGrantResolver extends BaseResolver<ResourceGrantModel, ResourceGrantService>({
	objectType: ResourceGrant,
	createInputClass: CreateResourceGrantInput,
	updateInputClass: UpdateResourceGrantInput,
	serviceClass: ResourceGrantService,
	dtoClass: ResourceGrantDto,
	model: ResourceGrantModel,
	enabledQuerys: {
		mutationsPolicy: 'ENABLE_SPECIFIC',
		querysPolicy: 'ENABLE_SPECIFIC',
		querys: ['getMany'],
		mutations: ['create', 'deleteById', 'updateById']
	}
}) {}
