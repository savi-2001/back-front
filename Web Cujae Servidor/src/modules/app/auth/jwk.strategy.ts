import { Injectable, Logger } from '@nestjs/common'
import { JwtStrategy as PassportJwtStrategy, throwUnauthorizedException } from '@regiondev/nestjs-security'
import { AuthService } from './auth.service'
import { ValidateUserPayload } from './jwt-payload.interface'

@Injectable()
export class JwtStrategy extends PassportJwtStrategy {
	constructor(private authService: AuthService) {
		super()
	}

	async validate(payload: ValidateUserPayload) {
		const user = await this.authService.validateUser(payload)
		if (!user) {
			throwUnauthorizedException()
		}
		return user
	}
}
