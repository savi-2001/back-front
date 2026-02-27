import { Injectable } from '@nestjs/common'
import { logPreHooks } from './log.preHooks'
import { logPostHooks } from './log.postHooks'
import { LogService } from '../../log.service'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class LogHooks {
	constructor(private logService: LogService, private eventEmitter: EventEmitter2) {}

	public get preHooks() {
		return logPreHooks(this.logService)
	}
	public get postHooks() {
		return logPostHooks(this.eventEmitter)
	}
}
