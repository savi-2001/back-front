import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'
import {
	PageView,
	PageViewService,
	PageViewEventListener,
	PageViewResolver,
	PageViewHooks,
	PageViewRestHooks,
	PageViewController,
} from './page_view'
import { IpCountry } from './page_view/models/ipCountry.model'

@Module({
	imports: [TypegooseModule.forFeature([PageView]),TypegooseModule.forFeature([IpCountry])],
	providers: [PageViewEventListener, PageViewService, PageViewResolver, PageViewHooks, PageViewRestHooks],
	controllers: [PageViewController],
	exports: [PageViewService],
})
export class AnalyticsModule {}
