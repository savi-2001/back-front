import { Controller, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common'
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express'
import { RestGuard } from '@regiondev/nestjs-security'
import { BufferedFile } from './file.interface'
import { MinioClientService } from './minio.service'
import { MB_SIZE } from '../shared/utils/utils'

@Controller('image-upload')
export class ImageUploadController {
	constructor(private minioClientService: MinioClientService) {}

	@Post()
	@UseGuards(RestGuard)
	@UseInterceptors(FileInterceptor('upload', { limits: { fileSize: MB_SIZE.mb(10) } }))
	async uploadImage(@UploadedFile() file: BufferedFile) {
		return await this.minioClientService.upload(file as any)
	}

	@Post('uploadMany')
	@UseInterceptors(AnyFilesInterceptor({ limits: { fileSize: MB_SIZE.mb(10) } }))
	async uploadImages(@UploadedFiles() files: BufferedFile[]) {
		const promises = []
		files.forEach((file) => {
			promises.push(this.minioClientService.upload(file as any))
		})
		return await Promise.all(promises)
	}
}
