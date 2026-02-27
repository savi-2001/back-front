import { faker } from '@faker-js/faker'
import { AccountStatusEnum } from '~/modules/app/user/models/user.model'
import { BaseSeed, random } from './base.seed'

export class UserSeed extends BaseSeed('users') {
	async seed() {
		await this.deleteCollection()

		const collection = await this.getCollection()

		await collection.insertOne({
			name: 'Super admin',
			email: 'admin@gmail.com',
			accountStatus: AccountStatusEnum.Active,
			_deleted: false,
			passwordHash: '$2b$15$qHZmVYFwhpyGZZ5ipTKooO04xL3rCSfNjmRibUiZbAapkUD5eDUhC', //string
			createdAt: faker.date.past(),
			updatedAt: faker.date.recent(),
		})

		const users = []
		for (let i = 0; i < 100; i++) {
			users.push({
				_deleted: false,
				createdAt: faker.date.past(),
				updatedAt: faker.date.recent(),
				name: faker.person.fullName(),
				email: faker.internet.email(),
				accountStatus: [
					AccountStatusEnum.Active,
					AccountStatusEnum.Awaiting,
					AccountStatusEnum.Suspended,
				][random(3)],
				passwordHash: '$2b$15$qHZmVYFwhpyGZZ5ipTKooO04xL3rCSfNjmRibUiZbAapkUD5eDUhC',
			})
		}

		this.values = users

		await collection.insertMany(users)
	}
}
