import { Injectable } from '@nestjs/common'
import { logPreHooks } from './log.restPreHooks'
import { logPostHooks } from './log.restPostHooks'
import { LogService } from '../../log.service'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class LogRestHooks {
	constructor(private logService: LogService, private eventEmitter: EventEmitter2) {}

	public get preHooks() {
		return logPreHooks(this.logService)
	}
	public get postHooks() {
		return logPostHooks(this.eventEmitter)
	}
}
