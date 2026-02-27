import { Injectable } from '@nestjs/common'
import { userPreHooks } from './user.preHooks'
import { userPostHooks } from './user.postHooks'
import { UserService } from '../../user.service'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class UserHooks {
	constructor(private userService: UserService, private eventEmitter: EventEmitter2) {}

	public get preHooks() {
		return userPreHooks(this.userService)
	}
	public get postHooks() {
		return userPostHooks(this.userService, this.eventEmitter)
	}
}
