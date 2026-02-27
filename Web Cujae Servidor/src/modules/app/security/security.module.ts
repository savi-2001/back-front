import { Module, Global } from '@nestjs/common'
import config from '~config'
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis'
import { ThrottlerModule } from '@nestjs/throttler'
import { UserThrottlerModule } from '@regiondev/nestjs-security'
import { UserModule } from '../user/user.module'
import { RbacModule } from './rbac/rbac.module'
import { LogsModule } from '../logs/logs.module'

const throttlerConfig = {
	storage: new ThrottlerStorageRedisService(),
	ttl: parseInt(process.env.THROTTLER_TTL) * 2,
	limit: parseInt(process.env.THROTTLER_LIMIT),
	ignoreUserAgents: config.throttlerIgnoreAgents || [],
}

@Global()
@Module({
	imports: [
		ThrottlerModule.forRoot(throttlerConfig),
		UserThrottlerModule.forRoot(throttlerConfig),
		UserModule,
		RbacModule,
		LogsModule,
	],
	providers: [],
})
export class SecurityModule {}
