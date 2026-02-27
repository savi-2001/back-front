import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { User } from '~app/user/graphql/user.schema'

@ObjectType()
export class UserPayload {
	@Field((type) => User)
	user: User
	token: string
	refreshToken: string
}

@InputType()
export class RegisterUserInput {
	email: string
	name: string
	password: string
}
