import { CacheQuerys } from '@regiondev/nestjs-common'

export const eventCache: CacheQuerys = {
	policy: 'NONE', // disable cache for all querys
}
