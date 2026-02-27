import path from 'path'

/* eslint-disable @typescript-eslint/no-var-requires */
let loaded = false

function loadEnvironments() {
	const p = path.join(__dirname, '..', '..', 'environments')

	if (!loaded) {
		if (process.env.NODE_ENV === 'production') {
			require('custom-env').env('production', p)
		} else {
			require('custom-env').env('development', 'environments')
			require('custom-env').env('development.local', 'environments')
		}
		loaded = true
	}
}

export default loadEnvironments
