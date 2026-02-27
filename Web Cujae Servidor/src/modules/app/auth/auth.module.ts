import { HttpModule } from '@nestjs/axios'
import { forwardRef, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypegooseModule } from 'nestjs-typegoose'
import { User } from '~app/user/models/user.model'
import { UserModule } from '~app/user/user.module'
import { AuthResolver } from '../auth/graphql/auth.resolver'
import { AuthService } from './auth.service'
import { EmailVerification } from './models/email-verification.model'
import { ForgottenPassword } from './models/forgotten-password.model'
import { EmailVerificationService } from './services/email-verification.service'
import { ForgottenPasswordService } from './services/forgotten-password.service'
import { JwtOptions, SessionModule, Strategy } from '@regiondev/nestjs-security'
import { Traces } from '../traces/traces.model'
// import { MailModule } from '../mail/mail.module'
import { JwtStrategy } from './jwk.strategy'
import { JwksRsaController } from './jwks-rsa.controller'
import { RbacModule } from '../security/rbac/rbac.module'

@Module({
	imports: [
		SessionModule,
		JwtModule.register(JwtOptions),
		PassportModule.register(Strategy),
		TypegooseModule.forFeature([User, Traces, EmailVerification, ForgottenPassword]),
		forwardRef(() => UserModule),
		// MailModule,
		HttpModule,
		RbacModule,
	],
	controllers: [JwksRsaController],
	providers: [JwtStrategy, AuthService, AuthResolver, EmailVerificationService, ForgottenPasswordService],
	exports: [
		ForgottenPasswordService,
		EmailVerificationService,
		JwtModule,
		JwtStrategy,
		PassportModule,
		AuthService,
	],
})
export class AuthModule {}
