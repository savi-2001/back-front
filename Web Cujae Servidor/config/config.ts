import { IConfigOptions } from 'config/IConfigOptions.interface'
import { config as configDev } from './config.development'
import { config as configProd } from './config.production'

let config

if (isProd()) {
	config = configProd
} else {
	config = configDev
}

export default config as IConfigOptions

export function isProd() {
	return process.env.NODE_ENV == 'production'
}
