import { CacheQuerys } from '@regiondev/nestjs-common'

export const ticketCache: CacheQuerys = {
	policy: 'NONE', // disable cache for all querys
}
