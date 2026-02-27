export const pages_views = [
	{
		$count: 'pages_views',
	},
]

export const pages_views_by_hour = [
	{
		$project: {
			date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
			hour: { $dateToString: { format: '%H:00', date: '$createdAt' } }, // Format hour in HH:00 format
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

export const pages_views_browsers = [
	{
		$group: {
			_id: '$browser',
			count: { $sum: 1 },
		},
	},
	{
		$sort: { count: -1 },
	},
	{
		$project: {
			_id: 0,
			name: '$_id',
			count: 1,
		},
	},
]

export const pages_views_os = [
	{
		$group: {
			_id: '$os',
			count: { $sum: 1 },
		},
	},
	{
		$project: {
			_id: 0,
			name: '$_id',
			count: 1,
		},
	},
	{
		$sort: { count: -1 },
	},
]
export const pages_views_countries = [
	{
		$group: {
			_id: '$country_code',
			count: { $sum: 1 },
		},
	},
	{
		$project: {
			_id: 0,
			country_code: '$_id',
			count: 1,
		},
	},
	{
		$sort: { count: -1 },
	},
]

export const pages_views_pages = [
	{
		$group: {
			_id: '$path',
			count: { $sum: 1 },
		},
	},
	{
		$project: {
			_id: 0,
			path: '$_id',
			count: 1,
		},
	},
	{
		$sort: { count: -1 },
	},
]
