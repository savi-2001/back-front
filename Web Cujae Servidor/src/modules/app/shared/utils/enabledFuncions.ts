import { EnabledQuerysOptions } from "@regiondev/nestjs-graphql/lib/types/enabledQuerys";


export const defaultQueryOptions: EnabledQuerysOptions = {
	mutationsPolicy: 'ENABLE_SPECIFIC',
	// Default mutations used in admin panel
	mutations: ['create', 'deleteById', 'deleteOne', 'updateById', 'updateOne'],
	querysPolicy: 'ENABLE_ALL',
	subscriptionsPolicy: 'ENABLE_ALL'
}
