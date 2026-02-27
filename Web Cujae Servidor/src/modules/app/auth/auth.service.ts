import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common'
import { CacheService } from '@regiondev/nestjs-common'
import {
	compareHash,
	createToken,
	getHashWithSalt,
	GET_RSA_PRIVATE_KEY,
	GET_RSA_PUBLIC_KEY,
} from '@regiondev/nestjs-security'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User, AccountStatusEnum } from '~app/user/models/user.model'
import { UserService } from '~app/user/user.service'
import { CACHE } from '../shared/utils/cache.constants'
import { LoginInputDto } from './dto/LoginInput.dto'
import { UpdatePasswordDto } from './dto/UpdatePasswordDto'
import { EmailVerificationService } from './services/email-verification.service'
import { ForgottenPasswordService } from './services/forgotten-password.service'

import { OnModuleInit } from '@nestjs/common'
import { Inject } from '@nestjs/common/decorators/core/inject.decorator'
import { SchedulerRegistry } from '@nestjs/schedule'
import { isString } from 'class-validator'
import { v4 as uuidv4 } from 'uuid'
import { CRONJOBS } from '../shared/utils/cronjobs.constants'
import { ValidateUserPayload } from './jwt-payload.interface'
import { RegisterUserInput } from './graphql/auth.schema'
import { RoleService } from '../security/rbac/services/role.service'

@Injectable()
export class AuthService implements OnModuleInit {
	@Inject(RoleService) RoleService: RoleService

	@Inject(GET_RSA_PUBLIC_KEY) getPublicKey: () => Buffer
	@Inject(GET_RSA_PRIVATE_KEY) getPrivateKey: () => Buffer
	private tokenExpTimeInMinutes = Number(process.env.TOKEN_EXPIRES_IN_MINUTES) || 15
	private refreshTokenExpTimeInMinutes = Number(process.env.REFRESH_TOKEN_EXPIRES_IN_MINUTES) || 60 * 24
	private isCleaningTokens: boolean
	private blackListExpirationTime: number = 60 * 60 * 24 * 380 // just a very big number
	privateKey: Buffer
	publicKey: Buffer

	constructor(
		private readonly userService: UserService,
		private readonly emailVerification: EmailVerificationService,
		private readonly forgotPassword: ForgottenPasswordService,
		private readonly cacheService: CacheService,
		private readonly schedulerRegistry: SchedulerRegistry,
	) {}

	onModuleInit() {
		this.privateKey = this.getPrivateKey()
		this.publicKey = this.getPublicKey()
		this.initJWTBlacklist()
	}

	async initJWTBlacklist() {
		const blacklistMap = await this.cacheService.getObject(CACHE.JWT_BLACKLIST)
		if (!blacklistMap) {
			await this.cacheService.setObject(CACHE.JWT_BLACKLIST, {}, this.blackListExpirationTime)
		}
		this.initIntervalClean()
	}
	initIntervalClean() {
		const msDif = 1000 * 60 * 60 * 24 // 24 hours

		const callback = async () => {
			this.isCleaningTokens = true

			const blacklistMap = await this.cacheService.getObject(CACHE.JWT_BLACKLIST)
			const newBlacklistMap = {}

			for (const key in blacklistMap) {
				if (Object.prototype.hasOwnProperty.call(blacklistMap, key)) {
					const { expiredTime } = blacklistMap[key]
					if (expiredTime + msDif > Date.now()) {
						newBlacklistMap[key] = blacklistMap[key]
					}
				}
			}

			const blacklistMapReserve = await this.cacheService.getObject(CACHE.JWT_BLACKLIST_RESERVE)
			const map = { ...newBlacklistMap, ...blacklistMapReserve }

			await this.cacheService.setObject(CACHE.JWT_BLACKLIST, map, this.blackListExpirationTime)

			this.isCleaningTokens = false
		}

		const interval = setInterval(callback, 1000 * 60 * 60 * 25) //every day
		this.schedulerRegistry.addInterval(CRONJOBS.JWT_BLACKLIST_JOB, interval)
	}

	async logout(token, refreshToken) {
		const key = this.isCleaningTokens ? CACHE.JWT_BLACKLIST_RESERVE : CACHE.JWT_BLACKLIST

		const blacklistMap = await this.cacheService.getObject(key)
		blacklistMap[token] = { expired: true, expiredTime: Date.now() }
		if (refreshToken) {
			blacklistMap[refreshToken] = { expired: true, expiredTime: Date.now() }
		}
		await this.cacheService.setObject(key, blacklistMap)
		return { status: true, message: 'Session closed succesfully' }
	}

	async tokenIsInBlackList(token) {
		if (token.startsWith('Bearer ')) {
			token = token.slice(7)
		}
		const blacklistMap = await this.cacheService.getObject(CACHE.JWT_BLACKLIST)
		return blacklistMap[token] ? true : false
	}

	async registerUser(input: RegisterUserInput) {
		const { password, email, name } = input
		const accountExists = await this.userService.getOne({
			email,
		})
		if (accountExists /* && accountExists.active */) {
			throw new ConflictException('Ya existe un usuario con ese correo registrado')
		} else if (accountExists && accountExists.accountStatus == AccountStatusEnum.Awaiting) {
			await accountExists.remove()
		}

		const { passwordHash, salt } = await getHashWithSalt(password)
		delete input.password

		try {
			const newUser = { passwordHash, salt, ...input, name }
			await this.userService.create(newUser)
			// const emailVerification = await this.createEmailToken(email)
			// if (emailVerification) {
			// 	const emailSend = await this.sendEmailVerification(user.email)
			// 	if (!emailSend) {
			// 		throw new BadRequestException('Email has not send')
			// 	}

			return { status: 200, message: 'Cuenta registrada' }
			// } else {
			// throw new BadRequestException('Email has not send')
			// }
		} catch (error) {
			Logger.error(error, 'error on register')
			throw new InternalServerErrorException()
		}
	}

	async createEmailToken(email: string) {
		const accountIsAwaiting = await this.userService.exists({
			email,
			accountStatus: AccountStatusEnum.Awaiting,
		})

		if (!accountIsAwaiting) {
			throw new BadRequestException()
		}

		const emailToken = await uuidv4()
		const emailVerification = await this.emailVerification.model.findOneAndUpdate(
			{ email },
			{
				emailToken,
				timestamp: new Date(),
			},
			{ upsert: true },
		)
		return emailVerification
	}

	async sendEmailVerification(email: string) {
		const user = await this.userService.getOne(
			{
				email,
				accountStatus: AccountStatusEnum.Awaiting,
			},
			{ lean: true },
		)
		const model = await this.emailVerification.model.findOne({ email })

		if (!user || !model || !model.emailToken) {
			throw new ForbiddenException()
		}

		// await this.mailService.sendVerificationEmail(user, model.emailToken)
		return true
	}

	async loginUser(input: LoginInputDto) {
		const { email, password } = input

		let user
		if (email) {
			user = await this.userService.getOne({
				email,
				accountStatus: AccountStatusEnum.Active,
			})
		} else {
			// user = await this.userService.getOne({
			// 	phoneNumber,
			// 	AccountStatusEnum: AccountStatusEnum.Active,
			// })
		}
		if (!user) {
			throw new BadRequestException()
		}
		const validCredentials = compareHash(password, user.passwordHash)

		if (!validCredentials) {
			throw new BadRequestException()
		}
		const { token, refreshToken } = await this.createTokens(user._id.toHexString())

		const roles = await this.RoleService.getAllUserRoles(user.id)
		return { token, refreshToken, user: { ...user.toJSON(), roles } }
	}

	async refreshTokenUser(refreshToken: string) {
		try {
			const verify = jwt.verify(refreshToken, this.publicKey, { ignoreExpiration: false })
			const sub = verify.sub

			if (!isString(sub) || !sub.startsWith('refreshToken_')) {
				throw new Error()
			}
			const userId = sub.slice('refreshToken_'.length)
			const user = await this.validateUser({ sub: userId })

			if (!user) {
				throw new Error()
			}

			const { refreshToken: newRefreshToken, token: newToken } = this.createTokens(userId)
			return { refreshToken: newRefreshToken, token: newToken, user }
		} catch (err) {
			throw new BadRequestException('Invalid refresh token')
		}
	}

	createTokens(userId, payload?) {
		return createToken(
			payload,
			userId,
			this.publicKey,
			this.privateKey,
			this.tokenExpTimeInMinutes,
			this.refreshTokenExpTimeInMinutes,
		)
	}

	async verifyEmail(token: string): Promise<SRecord> {
		const emailVerif = await this.emailVerification.getOne({ emailToken: token })
		if (emailVerif && emailVerif.email) {
			const user = await this.userService.getOne({
				email: emailVerif.email,
				active: false,
			})

			if (user) {
				user.accountStatus = AccountStatusEnum.Active
				await user.save()
				await emailVerif.remove()
				return { email: user.email }
			}
		} else {
			throw new BadRequestException('Invalid token')
		}
	}

	async changePassword(user: User, args: UpdatePasswordDto) {
		const { newPassword, oldPassword } = args
		const validCredentials = compareHash(oldPassword, user.passwordHash)

		if (!validCredentials) {
			throw new BadRequestException('', 'La contraseña no es correcta')
		}

		// TODO: Here send link to user email informing that password have been changed
		return this.setPasswordToUser(user._id, newPassword)
	}

	async setPasswordToUser(userId, password) {
		const passwordObject = await getHashWithSalt(password)
		const userUpdated = await this.userService.updateById(userId, passwordObject)
		return userUpdated
	}

	async sendEmailForgotPassword(email: string): Promise<boolean> {
		const user = await this.userService.getOne({ email, active: true }, { lean: true })
		if (!user) {
			throw new BadRequestException()
		}

		const model = await this.forgotPassword.getOne({ email })
		if (model) {
			const emailPasswordHasSended =
				(new Date().getTime() - new Date(model.updatedAt).getTime()) / 60000 < 60
			if (emailPasswordHasSended) {
				return true
			} else {
				model.remove()
			}
		}

		const salt = bcrypt.genSaltSync(3)
		const token = salt.split('/').join('').split('\\').join()
		await this.forgotPassword.create({ email, passwordToken: token })

		// await this.mailService.sendForgotPasswordEmail(user, token)
		return true
	}

	async validateUser(payload: ValidateUserPayload) {
		const id: string = payload.sub

		if (id) {
			const userFromCache = await this.cacheService.getObject(CACHE.USER(id))

			if (!userFromCache) {
				const userFromDb = await await this.userService.getById(id)
				if (!userFromDb) return null
				else {
					const user = {
						...userFromDb.toJSON(),
						id: userFromDb._id.toHexString(),
					}
					await this.cacheService.setObject(CACHE.USER(id), user, 60 * 5)
					return user
				}
			}
			return userFromCache
		}
		return null
	}
}
