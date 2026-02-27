import { ThrottlerLimiter } from '@regiondev/nestjs-security'

export const ipRateLimit: ThrottlerLimiter = {
	// getById: { limit: 2, ttl: 10 },   // 2 request per 10 seconds
}
export const userRateLimit: ThrottlerLimiter = {}
