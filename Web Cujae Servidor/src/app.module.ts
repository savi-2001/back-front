import { AppService } from './app.service'
import { StatisticsModule } from './modules/admin/statistics.module'
import { ApolloDriver } from '@nestjs/apollo'
import { Logger, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { GraphQLModule } from '@nestjs/graphql'
import { ScheduleModule } from '@nestjs/schedule'
import { ServeStaticModule } from '@nestjs/serve-static'
import { AppCacheModule } from '@regiondev/nestjs-common'
import { RedisModule } from '@regiondev/nestjs-integrations'
import { TypegooseModule } from 'nestjs-typegoose'
import { join } from 'path'
import config from '~config'
import { APP_PROVIDERS } from './app.providers'
import { MONGO_OPTIONS } from './appConfig/mongo.config'
import { AllBusinessModule } from './business.module'
import { AppController } from './modules/app.controller'
import { AuthModule } from './modules/app/auth/auth.module'
import { AuthService } from './modules/app/auth/auth.service'
import { ConfigModule } from './modules/app/config/config.module'
import { SecurityModule } from './modules/app/security/security.module'
import { GraphqlOptions } from './modules/app/shared/graphql/graphql.config'
import { UserModule } from './modules/app/user/user.module'
import { UserService } from './modules/app/user/user.service'
import { MinioClientModule } from './modules/app/minio/minio.module'
import { HttpModule } from '@nestjs/axios'
import { RestEncryptionMiddleware } from './modules/app/security/rest-encryption.middleware'
import { EncryptionMiddleware } from '@regiondev/nestjs-security'

@Module({
	imports: [
		StatisticsModule,
		HttpModule,
		AllBusinessModule,
		ConfigModule,
		EventEmitterModule.forRoot({ global: true }),
		AppCacheModule.register({
			host: '127.0.0.1',
			cacheLimit: 10000000,
			port: parseInt(process.env.REDIS_PORT),
			ttl: Number.MAX_SAFE_INTEGER,
		}),
		MinioClientModule,
		RedisModule.forRoot({
			host: '127.0.0.1',
			port: parseInt(process.env.REDIS_PORT),
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', '..', 'public'),
		}),
		TypegooseModule.forRoot(config.mongoUrl, MONGO_OPTIONS as any),
		ScheduleModule.forRoot(),
		SecurityModule,
		AuthModule,
		GraphQLModule.forRootAsync({
			driver: ApolloDriver,
			useClass: GraphqlOptions,
			imports: [UserModule, AuthModule],
			inject: [UserService, AuthService],
		}),
	],
	controllers: [AppController],
	providers: [...APP_PROVIDERS, AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		if (config.enableEncryption) {
			consumer.apply(EncryptionMiddleware).forRoutes('graphql')
			consumer
				.apply(RestEncryptionMiddleware)
				.exclude('graphql')
				.forRoutes({ path: '*', method: RequestMethod.ALL })
		}
	}
}
