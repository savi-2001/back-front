import { Global, Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { ResourceGrant } from './models/resourceGrant.model'
import { Role } from './models/role.model'
import { RoleUser } from './models/roleUser.model'
import { ResourceGrantResolver } from './resolvers/resourceGrant.resolver'
import { RoleResolver } from './resolvers/role.resolver'
import { RoleUserResolver } from './resolvers/roleUser.resolver'
import { ResourceGrantService } from './services/resourceGrant.service'
import { RoleService } from './services/role.service'
import { RoleUserService } from './services/roleUser.service'
import { RbacGuard } from './guards/rbac.guard'

@Module({
	imports: [TypegooseModule.forFeature([ResourceGrant, Role, RoleUser])],
	providers: [
		ResourceGrantService,
		RoleService,
		RoleUserService,
		ResourceGrantResolver,
		RoleResolver,
		RoleUserResolver,
		RbacGuard,
	],
	exports: [ResourceGrantService, RoleService],
})
@Global()
export class RbacModule {}
