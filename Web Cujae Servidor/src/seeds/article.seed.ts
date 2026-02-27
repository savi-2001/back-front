import { faker } from '@faker-js/faker'
import { BaseSeed, random, array } from './base.seed'

export class ArticleSeed extends BaseSeed('articles') {
	async seed(count = 100, insert = false) {
		const getArticle = () => ({
			title: faker.lorem.sentence(),
			images: array(faker.image.abstract),
			datePublished: faker.date.past(),
			articleBody: faker.lorem.lines(),
			summary: faker.lorem.paragraph(),
		})

		await this._seed(getArticle, count, insert)
	}
}
