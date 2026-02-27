import { NestExpressApplication } from '@nestjs/platform-express'
import { DtoValidationPipe } from '@regiondev/nestjs-common'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { configureSwagger } from './configureSwagger'

export async function configureApp(app: NestExpressApplication) {
	app.use(helmet())
	app.use(cookieParser())

	app.useGlobalPipes(new DtoValidationPipe({ transform: true }))

	app.use('*', (req, res, next) => {
		const query = req.query?.query || req.body?.query || ''
		if (query.length > 2000) {
			throw new Error('Query too large')
		}
		next()
	})
	if (process.env.NODE_ENV === 'production') {
		configureAppForProduction(app)
	} else {
		configureAppForDevelopment(app)
	}
}

function configureAppForProduction(app: NestExpressApplication) {
	app.set('trust proxy', 1)
	// app.enableCors({
	// 	optionsSuccessStatus: 200,
	// 	allowedHeaders: 'Content-Type,Authorization',
	// 	origin: config.allowedOriginCors,
	// 	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	// })
	app.enableCors({
		optionsSuccessStatus: 200,
		origin: '*',
		allowedHeaders: '*',
		credentials: true,
		methods: '*',
	})
}
function configureAppForDevelopment(app: NestExpressApplication) {
	configureSwagger(app)
	app.enableCors()
}
