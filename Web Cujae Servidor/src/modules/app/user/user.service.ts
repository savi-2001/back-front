import { Injectable } from '@nestjs/common'
import { BaseService } from '@regiondev/nestjs-common'
import { User } from './models/user.model'

@Injectable()
export class UserService extends BaseService<User>(User) {}
