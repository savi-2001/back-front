import { Field, InputType } from '@nestjs/graphql'
import { IsEmail, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator'

@InputType()
export class LoginInputDto {
	@Field({ nullable: true })
	@IsEmail()
	// @ValidateIf((obj) => obj.phone_number == null)
	email: string

	// @Field({ nullable: true })
	// @ValidateIf((obj) => obj.email == null)
	// phoneNumber: string

	@Field()
	@IsString()
	@MinLength(8)
	password: string
}
