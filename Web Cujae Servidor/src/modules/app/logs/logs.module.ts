import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import { Log, LogController, LogEventListener, LogHooks, LogResolver, LogRestHooks, LogService } from './log'

@Module({
	imports: [TypegooseModule.forFeature([Log])],
	providers: [LogEventListener, LogService, LogResolver, LogHooks, LogRestHooks],
	controllers: [LogController],
	exports: [LogService],
})
export class LogsModule {}
