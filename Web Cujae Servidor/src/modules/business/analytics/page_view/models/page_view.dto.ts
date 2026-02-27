import { ALWAYS, BaseDto } from '@regiondev/nestjs-common'
import { IsOptional, IsString } from 'class-validator'
import { PageView } from './page_view.model'

export class PageViewDto extends BaseDto<PageView> {
	@IsString(ALWAYS)
	path: string
	
	@IsString(ALWAYS)
	uuid: string

	@IsString(ALWAYS)
	@IsOptional(ALWAYS)
	referer: string
}
