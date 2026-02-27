import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { BaseService } from '@regiondev/nestjs-common'
import { PageView } from './models/page_view.model'
import { InjectModel } from 'nestjs-typegoose'
import { IpCountry } from './models/ipCountry.model'
import { ReturnModelType } from '@typegoose/typegoose'
import { unique_ips } from '~/modules/admin/aggregations'

@Injectable()
export class PageViewService extends BaseService<PageView>(PageView) {
	@InjectModel(IpCountry) private IpCountryModel: ReturnModelType<typeof IpCountry>

	async getCountryCode(ip:string) {
		const ipnumber = Number(ip.split('.').map((num) => String(num).padStart(3, '0')).join(''))
		const result = await this.IpCountryModel.findOne({
			range_start_number: { $lte: ipnumber },
			range_end_number: { $gte: ipnumber },
		})

		return result.country_code
	}

	async pagesViewByPath(path: string) {
		const views = await this.model.aggregate([
			{
				$match:{path}
			},
			...unique_ips
		])

		return views?.[0]?.unique_ips || 0
	}
}
