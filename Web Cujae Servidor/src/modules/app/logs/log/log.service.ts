import { Injectable } from '@nestjs/common'
import { BaseService } from '@regiondev/nestjs-common'
import { Log } from './models/log.model'

@Injectable()
export class LogService extends BaseService<Log>(Log) {
	async onModuleInit() {

		// let promises, docs
		// do {
		// 	promises = []
		// 	docs = await this.IpCountryModel.find({ range_start_number: null }).limit(10000)
	
		// 	for (const doc of docs) {
		// 		try {
		// 			const range_start_number = Number(
		// 				doc.range_start
		// 					.split('.')
		// 					.map((num) => String(num).padStart(3, '0'))
		// 					.join(''),
		// 			)
		// 			const range_end_number = Number(
		// 				doc.range_end
		// 					.split('.')
		// 					.map((num) => String(num).padStart(3, '0'))
		// 					.join(''),
		// 			)
		// 			doc.range_end_number = range_end_number
		// 			doc.range_start_number = range_start_number
		// 			await doc.save()
		// 		} catch (err) {
		// 			Logger.error(doc.toJSON(), '')
		// 			return
		// 		}
		// 		// promises.push(doc.save())
		// 	}
		// 	await Promise.all(promises)
		// 	Logger.verbose('Proceced 5000')
		// }
		// while ((await this.IpCountryModel.find({ range_start_number: null }).count()) > 0)
	}

}
