import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export function configureSwagger(app) {
	const swaggerConfig = new DocumentBuilder()
		.setTitle('API Documentation')
		.setDescription('API documentation description')
		.setVersion('1.0')
		.build()

	const document = SwaggerModule.createDocument(app, swaggerConfig)
	SwaggerModule.setup('api-docs', app, document, {
		customCssUrl: '/docs.css',
		customSiteTitle: 'Api Documentation',
	})
}
