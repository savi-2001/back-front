import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { configureApp } from './appConfig/configureApp'
import config from '~config'
import { NestExpressApplication } from '@nestjs/platform-express'

declare const module: any

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		bodyParser: true,
	})
	await configureApp(app)
	process.setMaxListeners(0)
	await app.init()
	await app.listen(process.env.PORT)

	Logger.log(`Nest Server on ${config.host}`, `Bootstrap ${process.env.PORT}`)

	if (module.hot) {
		module.hot.accept()
		module.hot.dispose(() => app.close())
	}
}
bootstrap()
