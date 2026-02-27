import { RangeEnum } from '~/modules/admin/types'

export const tuple = <T extends string[]>(...args: T) => args

export function generatePassword() {
	const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
	const lowercase = 'abcdefghijklmnopqrstuvwxyz'
	const digits = '0123456789'
	const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?'

	const getRandomChar = (chars) => chars[Math.floor(Math.random() * chars.length)]

	// Ensure the password includes specific characters
	const password = [
		getRandomChar(uppercase),
		getRandomChar(uppercase),
		getRandomChar(uppercase),
		getRandomChar(lowercase),
		getRandomChar(lowercase),
		getRandomChar(lowercase),
		getRandomChar(digits),
		getRandomChar(digits),
		getRandomChar(specialChars),
	]

	// Shuffle the password array to ensure a random order
	for (let i = password.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
			;[password[i], password[j]] = [password[j], password[i]]
	}

	return password.join('')
}

export function getDatesForRange(range: RangeEnum) {
	const now = Date.now()
	const DAY_MS = 24 * 60 * 60 * 1000
	const date_to = new Date(new Date(now).setMonth(new Date(now).getMonth() + 1))

	let date_from
	switch (range) {
		case RangeEnum.last_24_hours:
			date_from = now - DAY_MS
			break
		case RangeEnum.last_week:
			date_from = now - 7 * DAY_MS
			break
		case RangeEnum.last_month:
			date_from = now - 7 * DAY_MS * 28
			break
	}
	return {
		date_from: new Date(date_from),
		date_to,
	}
}

export function buildUrlWithQueryParams(baseUrl, params) {
	const queryParams = Object.keys(params)
		.map((key) => {
			const encodedKey = encodeURIComponent(key)
			const encodedValue = encodeURIComponent(JSON.stringify(params[key]))
			return `${encodedKey}=${encodedValue}`
		})
		.join('&')
	return `${baseUrl}?${queryParams}`
}

export function createSlug(title) {
	const map = {
		'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
		'Á': 'a', 'É': 'e', 'Í': 'i', 'Ó': 'o', 'Ú': 'u',
		'ñ': 'n', 'Ñ': 'n'
	};

	return title
		.toLowerCase()
		.trim()
		.replace(/[áéíóúÁÉÍÓÚñÑ]/g, (match) => map[match])
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
}


export const MB_SIZE = {
	1: 1024 * 1024,
	mb: (num: number) => MB_SIZE[1] * num
}
