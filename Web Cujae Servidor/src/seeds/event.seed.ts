import { faker } from '@faker-js/faker'
import { BaseSeed, random, array } from './base.seed'

export class EventSeed extends BaseSeed('events') {
	async seed(count = 100, insert = false) {
		const getEvent = () => ({
			startDate: faker.date.future(),
			endDate: faker.date.future(),
			eventAttendanceMode: [
				'MixedEventAttendanceMode',
				'OfflineEventAttendanceMode',
				'OnlineEventAttendanceMode',
			][random(3)],
			eventStatus: [
				'EventCancelled',
				'EventMovedOnline',
				'EventPostponed',
				'EventRescheduled',
				'EventScheduled',
			][random(5)],
			location: faker.address.nearbyGPSCoordinate(),
			images: array(faker.image.abstract),
			title: faker.music.songName(),
			description: faker.lorem.paragraph(),
		})

		await this._seed(getEvent, count, insert)
	}
}
