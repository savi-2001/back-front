import { Module } from '@nestjs/common'
import { MinioModule } from 'nestjs-minio-client'
import { ImageUploadController } from './minio.controller'
import { MinioClientService } from './minio.service'
import config from '~config'

@Module({
	imports: [
		MinioModule.register({
			endPoint: config.minio.endPoint,
			port: config.minio.port,
			accessKey: config.minio.accessKey,
			secretKey: config.minio.secretKey,
			useSSL: false, // If deployed on https true, false otherwise.
		}),
	],
	providers: [MinioClientService],
	exports: [MinioClientService],
	controllers: [ImageUploadController],
})
export class MinioClientModule {}
