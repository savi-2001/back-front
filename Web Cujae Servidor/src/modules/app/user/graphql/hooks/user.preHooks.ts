import { PreHooksFunctions } from '@regiondev/nestjs-graphql'
import { UserService } from '../../user.service'
import { User } from '../../models/user.model'
import { Logger } from '@nestjs/common'
import { getHashWithSalt } from '@regiondev/nestjs-security'
import { generatePassword } from '~/modules/app/shared/utils/utils'

export function userPreHooks(userService: UserService): PreHooksFunctions<User> {
	return {
		async create(params) {
			const newInputData: any = { ...params.input.data }
			const password = generatePassword()
			const { passwordHash, salt } = await getHashWithSalt(password)

			newInputData.password = password
			newInputData.passwordHash = passwordHash
			newInputData.salt = salt

			return { ...params.input, data: newInputData }
		},
	}
}
