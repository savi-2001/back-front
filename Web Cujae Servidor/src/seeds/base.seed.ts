import { mongoose } from '@typegoose/typegoose'
import { MongoClient } from 'mongodb'
import config from '~config'

const client = new MongoClient(config.mongoUrl)
type Reference = {
	key: string
	values: any[]
}

export const BaseSeed = (collectionName: string) => {
	class BaseSeed {
		public values: any[] = []

		async getCollection() {
			await client.connect()
			const db = client.db()
			const collection = db.collection(collectionName)
			return collection
		}
		async insert() {
			await this.deleteCollection()
			const collection = await this.getCollection()
			const items = this.values.map((i) => ({
				_deleted: false,
				createdAt: new Date(),
				updatedAt: new Date(),
				_id: new mongoose.Types.ObjectId(),
				...i,
			}))
			this.values = items

			await collection.insertMany(this.values)
		}
		async deleteCollection() {
			const db = client.db()
			await db.collection(collectionName).deleteMany({})
		}

		async setRefs(references: Reference[], insertAfterUpdate = true, unique?: string[]) {
			await this.deleteCollection()

			this.values = this.values.map((val) => {
				const newVal = { ...val }

				references.forEach((ref) => {
					newVal[ref.key] = ref.values[Math.floor(Math.random() * ref.values.length)]._id
				})

				return newVal
			})

			insertAfterUpdate && (await this.insert())
		}

		async _seed(seedFn: () => any, count = 10, insert = false) {
			this.values = Array.from({ length: count }, () => ({
				...seedFn(),
				_id: new mongoose.Types.ObjectId(),
			}))

			insert && (await this.insert())
		}
	}

	return BaseSeed
}
export const random = (max: number) => Math.floor(Math.random() * max)
export const array = (fn, count = 5) => Array.from({ length: count }, fn)
