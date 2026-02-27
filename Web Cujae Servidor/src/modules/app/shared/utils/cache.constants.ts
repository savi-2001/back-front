import { CACHE as SEC_CACHE } from '@regiondev/nestjs-security'

export const CACHE = {
	...SEC_CACHE,
	JWT_BLACKLIST_RESERVE: 'JWT_BLACKLIST_RESERVE',
	USER_ROLES_MAP: 'USER_ROLES_MAP',
	USER: (id: string) => 'USER_' + id,
}
