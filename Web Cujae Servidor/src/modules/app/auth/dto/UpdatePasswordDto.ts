import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

@InputType()
export class UpdatePasswordDto {
	@Field()
	@IsString()
	@MinLength(8)
	oldPassword: string

	@Field()
	@IsString()
	@MinLength(8)
	newPassword: string
}

@InputType()
export class VerifyTokenPasswordDto {
	@Field()
	@IsString()
	@MinLength(8)
	@MaxLength(100)
	passwordToken: string

	@Field()
	@IsEmail()
	email: string
}

@InputType()
export class ResetPasswordDto extends VerifyTokenPasswordDto {
	@Field()
	@IsString()
	@MinLength(8)
	@MaxLength(100)
	newPassword: string
}

@InputType()
export class ResetPasswordViaPhoneDto {
	@Field()
	@IsString()
	@MinLength(8)
	@MaxLength(100)
	newPassword: string

	@Field()
	@IsString()
	@MinLength(6)
	@MaxLength(6)
	verificationCode: string

	@Field()
	@IsString()
	@MinLength(8)
	@MaxLength(8)
	phoneNumber: string
}
