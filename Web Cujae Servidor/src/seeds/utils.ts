import config from '../../config/config'
import { MongoClient } from 'mongodb'

export async function deleteCollections() {
	const collections = []
	const client = new MongoClient(config.mongoUrl)
	await client.connect()
	const db = client.db()

	for (const collectionName of collections) {
		await db.dropCollection(collectionName)
	}
}
