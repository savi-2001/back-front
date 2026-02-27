import { Injectable } from '@nestjs/common'
import { BaseService } from '@regiondev/nestjs-common'
import { RoleUser } from '../models/roleUser.model'

@Injectable()
export class RoleUserService extends BaseService<RoleUser>(RoleUser) {}
