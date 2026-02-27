import { Injectable } from '@nestjs/common'
import { Traces } from './traces.model'
import { Global } from '@nestjs/common'
import { BaseService } from '@regiondev/nestjs-common'

@Global()
@Injectable()
export class TracesService extends BaseService<Traces>(Traces) {}
