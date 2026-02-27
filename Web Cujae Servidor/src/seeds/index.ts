import { UserSeed } from './user.seed'
import { ArticleSeed } from './article.seed'
import { EventSeed } from './event.seed'

const seed = async () => {
	const userSeed = new UserSeed()
	await userSeed.seed()

	const articleSeed = new ArticleSeed()
	await articleSeed.seed(100, true)

	const eventSeed = new EventSeed()
	await eventSeed.seed(100, true)

	process.exit()
}

seed()
