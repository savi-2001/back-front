import { TracesService } from './traces.service'
import { Global, Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { TypegooseModule } from 'nestjs-typegoose'

import { TracesInterceptor } from './traces.interceptor'
import { Traces } from './traces.model'

@Global()
@Module({
	imports: [TypegooseModule.forFeature([Traces])],
	controllers: [],
	providers: [
		TracesService,
		{
			provide: APP_INTERCEPTOR,
			useClass: TracesInterceptor,
		},
	],
	exports: [TracesService],
})
export class TracesModule {}
