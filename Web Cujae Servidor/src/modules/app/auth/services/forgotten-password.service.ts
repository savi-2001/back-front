import { Injectable } from '@nestjs/common'
import { BaseService } from '@regiondev/nestjs-common'
import { ForgottenPassword } from '../models/forgotten-password.model'

@Injectable()
export class ForgottenPasswordService extends BaseService<ForgottenPassword>(ForgottenPassword) {}
