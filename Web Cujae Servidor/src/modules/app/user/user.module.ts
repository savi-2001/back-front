/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { RbacModule } from '../security/rbac/rbac.module'
import { UserResolver } from './graphql/user.resolver'
import { User } from './models/user.model'
import { UserService } from './user.service'
import { UserHooks } from './graphql/hooks/user.hooks'

@Module({
	imports: [RbacModule, TypegooseModule.forFeature([User])],
	providers: [UserService, UserResolver,UserHooks],
	exports: [UserService],
})
export class UserModule { }
