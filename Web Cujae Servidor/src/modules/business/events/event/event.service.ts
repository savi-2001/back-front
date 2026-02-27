import { Injectable } from '@nestjs/common'
import { BaseService } from '@regiondev/nestjs-common'
import { Event } from './models/event.model'

@Injectable()
export class EventService extends BaseService<Event>(Event) {}
