export const unique_ips = [
	{
		$group: {
			_id: '$ip',
		},
	},
	{
		$count: 'unique_ips',
	},
]

export const unique_ips_by_hour = [
	{
		$group: {
			_id: '$ip',
			minCreatedAt: { $min: '$createdAt' },
		},
	},
	{
		$project: {
			date: { $dateToString: { format: '%Y-%m-%d', date: '$minCreatedAt' } },
			hour: { $dateToString: { format: '%H:00', date: '$minCreatedAt' } }, // Format hour in HH:00 format
			ip: '$_id',
		},
	},
	{
		$group: {
			_id: { date: '$date', hour: '$hour' },
			count: { $sum: 1 },
		},
	},
	{
		$sort: { '_id.date': 1, '_id.hour': 1 },
	},
	{
		$project: {
			_id: 0,
			date: '$_id.date',
			hour: '$_id.hour',
			count: 1,
		},
	},
]

export const browsers = [
	{
		$group: {
			_id: '$ip',
			browsers: { $addToSet: '$browser' },
		},
	},
	{
		$project: {
			first_browser: { $arrayElemAt: ['$browsers', 0] },
		},
	},
	{
		$group: {
			_id: '$first_browser',
			unique_ips: { $addToSet: '$_id' },
		},
	},
	{
		$project: {
			_id: 0,
			name: '$_id',
			count: { $size: '$unique_ips' },
		},
	},
	{
		$sort: { count: -1 },
	},
]

export const operatingSystem = [
	{
		$group: {
			_id: '$ip',
			operating_systems: { $addToSet: '$os' },
		},
	},
	{
		$project: {
			first_operating_system: { $arrayElemAt: ['$operating_systems', 0] },
		},
	},
	{
		$group: {
			_id: '$first_operating_system',
			unique_ips: { $addToSet: '$_id' },
		},
	},
	{
		$project: {
			_id: 0,
			name: '$_id',
			count: { $size: '$unique_ips' },
		},
	},
	{
		$sort: { count: -1 },
	},
]

export const referrers = [
	{
		$group: {
			_id: '$http_referer',
			unique_ips: { $addToSet: '$ip' },
		},
	},
	{
		$project: {
			name: '$_id',
			_id: 0,
			count: { $size: '$unique_ips' },
		},
	},
	{
		$sort: { count: -1 },
	},
]

export const pages = [
	{
		$group: {
			_id: '$path',
			unique_ips: { $addToSet: '$ip' },
		},
	},
	{
		$project: {
			path: '$_id',
			_id: 0,
			count: { $size: '$unique_ips' },
		},
	},
	{
		$sort: { count: -1 },
	},
]

export const countries = [
	{
		$group: {
			_id: '$country_code',
			unique_ips: { $addToSet: '$ip' },
		},
	},
	{
		$project: {
			country_code: '$_id',
			_id: 0,
			count: { $size: '$unique_ips' },
		},
	},
	{
		$sort: { count: -1 },
	},
]
