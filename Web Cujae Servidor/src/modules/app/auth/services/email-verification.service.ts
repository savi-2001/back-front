import { Injectable } from '@nestjs/common'
import { BaseService } from '@regiondev/nestjs-common'
import { EmailVerification } from '../models/email-verification.model'

@Injectable()
export class EmailVerificationService extends BaseService<EmailVerification>(EmailVerification) {}
