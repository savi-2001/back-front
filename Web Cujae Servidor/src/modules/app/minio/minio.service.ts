import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import * as crypto from 'crypto'
import { FileUpload } from 'graphql-upload'
import { MinioService } from 'nestjs-minio-client'
import sharp from 'sharp'
import config from '~config'

@Injectable()
export class MinioClientService {
	private readonly bucketName = config.minio.bucketName

	async onModuleInit() {
		const bucket = await this.client.bucketExists(this.bucketName)
		if (!bucket) await this.client.makeBucket(this.bucketName, 'sgd')
	}

	// async init() {
	// 	Logger.verbose(this.bucketName, 'bucketName')
	// 	await this.client.makeBucket('cujae-bucket', 'sgd')
	// 	Logger.verbose('after')
	// 	// const bucket = await this.client.bucketExists(this.bucketName)
	// 	// if (!bucket) await this.client.makeBucket(this.bucketName, 'sgd')

	// 	// const bucket = await this.client.bucketExists(this.bucketName)
	// 	// Logger.verbose(bucket, 'bucket')
	// 	// if (!bucket) await this.client.makeBucket(this.bucketName, 'sgd')
	// }

	constructor(private readonly minio: MinioService) {
		const policy = {
			Version: '2012-10-17',
			Statement: [
				{
					Effect: 'Allow',
					Principal: {
						AWS: ['*'],
					},
					Action: ['s3:ListBucketMultipartUploads', 's3:GetBucketLocation', 's3:ListBucket'],
					Resource: [`arn:aws:s3:::${this.bucketName}`], // Change this according to your bucket name
				},
				{
					Effect: 'Allow',
					Principal: {
						AWS: ['*'],
					},
					Action: [
						's3:PutObject',
						's3:AbortMultipartUpload',
						's3:DeleteObject',
						's3:GetObject',
						's3:ListMultipartUploadParts',
					],
					Resource: [`arn:aws:s3:::${this.bucketName}/*`], // Change this according to your bucket name
				},
			],
		}
		this.client.setBucketPolicy(process.env.MINIO_BUCKET_NAME, JSON.stringify(policy))
	}

	public get client() {
		return this.minio.client
	}

	public async upload(
		file: FileUpload,
		bucketName: string = this.bucketName,
		type: 'rest' | 'graphql' = 'rest',
	) {
		const { mimetype } = await file

		let buffer
		if (type == 'graphql') {
			buffer = file.createReadStream()
		} else {
			buffer = (file as any).buffer
		}

		const optimizedBuffer = await sharp(buffer).resize().webp({ effort: 3 }).toBuffer()
		const optimizedXLBuffer = await sharp(buffer)
			.resize({ height: 200, width: 200 })
			.webp({ effort: 3 })
			.toBuffer()

		const timestamp = Date.now().toString()
		const hashedFileName = crypto.createHash('md5').update(timestamp).digest('hex')
		const extension = mimetype.split('/')[1]
		const metaData = {
			'Content-Type': file.mimetype,
		}

		const fileName = `${hashedFileName}.webp`
		const fileNameOptimized = `reduced_${hashedFileName}.webp`
		const fileNameXlOptimized = `reduced_xl_${hashedFileName}.webp`

		try {
			await this.client.putObject(bucketName, fileName, buffer, null, metaData)
			await this.client.putObject(bucketName, fileNameOptimized, optimizedBuffer, null, metaData)
			await this.client.putObject(bucketName, fileNameXlOptimized, optimizedXLBuffer, null, metaData)
		} catch (err) {
			throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST)
		}

		return {
			filePath: `${bucketName}/${fileName}`,
			fileName: fileName,
		}
	}

	delete(objetName: string, bucketName = this.bucketName) {
		this.client.removeObject(bucketName, objetName, (err: any) => {
			if (err)
				throw new HttpException(
					'An error occured when deleting object!',
					HttpStatus.INTERNAL_SERVER_ERROR,
				)
		})
	}
}
