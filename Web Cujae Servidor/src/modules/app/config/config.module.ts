import { Module, Global } from '@nestjs/common'
import { GLOBAL_PROVIDERS } from './providers'

@Module({
	providers: GLOBAL_PROVIDERS,
	exports: GLOBAL_PROVIDERS,
})
@Global()
export class ConfigModule {}
