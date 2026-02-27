import { BadRequestException, HttpStatus, Logger, NotFoundException, UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { GetUser, GqlHeaders, Json, Session } from '@regiondev/nestjs-graphql'
import { compareHash, GqlAuthGuard, Throttler, validatePassword } from '@regiondev/nestjs-security'
import { isEmail, isJWT, isString } from 'class-validator'
import { AdminGuard } from '../../security/rbac/guards/admin.guard'
import { User as UserType } from '../../user/graphql/user.schema'
import { UserDto } from '../../user/models/user.dto'
import { AccountStatusEnum } from '../../user/models/user.model'
import { UserService } from '../../user/user.service'
import { AuthService } from '../auth.service'
import { ForgottenPasswordService } from '../services/forgotten-password.service'
import { LoginInputDto } from './../dto/LoginInput.dto'
import { ResetPasswordDto, UpdatePasswordDto, VerifyTokenPasswordDto } from './../dto/UpdatePasswordDto'
import { RegisterUserInput, UserPayload } from './auth.schema'

@Resolver()
export class AuthResolver {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
		private readonly forgotPasswordService: ForgottenPasswordService,
	) {}

	// @Mutation((returns) => Json)
	// @Throttler({ limit: 5, ttl: 60 })
	// async registerUser(@Args('input', { type: () => RegisterUserInput }) input: RegisterUserInput) {
	// 	const { name, password, email } = input

	// 	const { feedback, valid } = validatePassword(password, 0)
	// 	if (!valid) {
	// 		throw new BadRequestException(feedback)
	// 	}

	// 	await new UserDto({
	// 		name,
	// 		email,
	// 		accountStatus: AccountStatusEnum.Awaiting,
	// 	}).validateCreateWithException()

	// 	return this.authService.registerUser(input)
	// }

	@Mutation((returns) => Json)
	@Throttler({ limit: 20, ttl: 60 })
	@AdminGuard()
	async adminRegisterUser(@Args('input', { type: () => RegisterUserInput }) input: RegisterUserInput) {
		const { name, password, email } = input

		const { feedback, valid } = validatePassword(password, 0)

		if (!valid) {
			throw new BadRequestException({ feedback })
		}

		await new UserDto({
			name,
			email,
		}).validateCreateWithException()

		return this.authService.registerUser({ ...input, accountStatus: AccountStatusEnum.Active } as any)
	}

	@Mutation((returns) => Json)
	@Throttler({ limit: 15, ttl: 60 })
	async verifyEmail(@Args('token', { type: () => String }) token: string) {
		if (!isString(token)) {
			throw new BadRequestException('invalid token')
		}
		const isEmailVerified = await this.authService.verifyEmail(token)
		if (isEmailVerified) {
			return {
				status: 200,
				message: 'El correo ha sido activado',
				...isEmailVerified,
			}
		}
		throw new NotFoundException()
	}

	@Mutation((returns) => Json)
	@Throttler({ limit: 15, ttl: 60 })
	async resendEmailVerification(@Args('email', { type: () => String }) email: string) {
		if (!isEmail(email)) {
			throw new BadRequestException('invalid email')
		}

		const isEmailSent = await this.authService.sendEmailVerification(email)

		await this.authService.createEmailToken(email)
		if (isEmailSent) {
			return { status: 200, message: 'El correo ha sido enviado' }
		}

		throw new NotFoundException()
	}

	@Mutation((returns) => Json)
	@Throttler({ limit: 5, ttl: 60 })
	async forgotPassword(
		@Args('email', { type: () => String, nullable: true }) email: string,
		@Args('phoneNumber', { type: () => String, nullable: true })
		phoneNumber: string,
	) {
		if (email) {
			if (!isEmail(email)) {
				throw new BadRequestException()
			}

			const isEmailSent = await this.authService.sendEmailForgotPassword(email)
			if (isEmailSent) {
				return { status: 200, message: 'El correo ha sido enviado' }
			}
		} /* else if (phoneNumber) {
			if (!validPhone(phoneNumber)) {
				throw new BadRequestException()
			}

			const verificationCode = await this.authService.sendVerificationCode(
				phoneNumber,
				CodeVerificationType.ResetPassword,
			)
			if (verificationCode) {
				return { status: 200 }
			} else {
				return { status: 500 }
			}
		} */

		throw new NotFoundException()
	}

	@Throttler({ limit: 5, ttl: 60 })
	@UseGuards(GqlAuthGuard)
	@Mutation((returns) => Json)
	async changePassword(
		@GetUser() user,
		@Args('input', { type: () => UpdatePasswordDto }) input: UpdatePasswordDto,
	) {
		const userUpdated = await this.authService.changePassword(user, input)
		if (userUpdated) {
			return {
				status: HttpStatus.OK,
				message: 'Contraseña cambiada',
			}
		}
		throw new NotFoundException()
	}

	@Throttler({ limit: 10, ttl: 60 })
	@Mutation((returns) => Json)
	async resetPassword(@Args('input', { type: () => ResetPasswordDto }) input: ResetPasswordDto) {
		const { email, newPassword, passwordToken } = input
		const forgot = await this.forgotPasswordService.getOne({
			email,
			passwordToken: passwordToken,
		})
		if (!forgot) {
			throw new BadRequestException()
		}

		const user = await this.userService.getOne({ email, active: true }, { lean: true })
		if (!user) {
			throw new BadRequestException()
		}

		const result = await this.authService.setPasswordToUser(user._id, newPassword)
		await forgot.remove()

		if (result) {
			return {
				status: HttpStatus.OK,
				message: 'Contraseña cambiada',
			}
		}
		throw new BadRequestException()
	}

	@Throttler({ limit: 10, ttl: 60 })
	@Mutation((returns) => UserPayload)
	async login(@Args('input', { type: () => LoginInputDto }) input): Promise<any> {
		const result = await this.authService.loginUser(input)
		return result
	}

	@Throttler({ limit: 10, ttl: 60 })
	@Mutation((returns) => UserPayload)
	async refreshToken(@GqlHeaders() headers): Promise<any> {
		const refreshToken = headers.refresh_token
		if (
			!refreshToken ||
			!isJWT(refreshToken) ||
			(await this.authService.tokenIsInBlackList(refreshToken))
		) {
			throw new BadRequestException('Invalid refresh token')
		} else {
			return await this.authService.refreshTokenUser(refreshToken)
		}
	}

	@Throttler({ limit: 10, ttl: 60 })
	@Mutation((returns) => Json)
	async verifyExistsPasswordForget(
		@Args('input', { type: () => VerifyTokenPasswordDto }) input,
	): Promise<any> {
		const { email, passwordToken } = input
		return await this.forgotPasswordService.exists({ email, passwordToken })
	}

	@Throttler({ limit: 10, ttl: 60 })
	@Mutation((returns) => Json)
	@UseGuards(GqlAuthGuard)
	async setUserEmail(
		@Args('email', { type: () => String }) email,
		@Args('password', { type: () => String }) password,
		@GetUser() user,
	): Promise<any> {
		const validCredentials = compareHash(password, user.passwordHash)
		if (!validCredentials) {
			throw new BadRequestException()
		} else {
			user.email = email
			await user.save()
			return { status: 200 }
		}
	}

	@Throttler({ limit: 10, ttl: 60 })
	@Query((returns) => UserType)
	@UseGuards(GqlAuthGuard)
	async getMe(@GetUser() user): Promise<any> {
		return user
	}

	@Throttler({ limit: 5, ttl: 60 })
	@Mutation((returns) => Json)
	@UseGuards(GqlAuthGuard)
	async logout(@GetUser() user, @GqlHeaders() headers): Promise<any> {
		const token = headers['Authorization'] || headers['authorization']
		const refreshToken = headers['RefreshToken'] || headers['refreshtoken']
		return this.authService.logout(token.slice('Bearer '.length), refreshToken)
	}
}
