/* eslint-disable prettier/prettier */
import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { ReturnModelType } from '@typegoose/typegoose'
import { InjectModel } from 'nestjs-typegoose'
import { Observable } from 'rxjs'
import { Traces } from './traces.model'

@Injectable()
export class TracesInterceptor implements NestInterceptor {
	constructor(
		@InjectModel(Traces) private tracesModel: ReturnModelType<typeof Traces>,
	) { }

	async intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Promise<Observable<any>> {
		const contextType: string = context.getType()

		if (contextType == 'http') {
			const ctx = context.switchToHttp()
			const req = ctx.getRequest()
			const user = req.user

			let userId, userName
			if (user) {
				userId = user.id
				userName = user.name
			}
			const operation = context.getHandler().name
			await this.tracesModel.create({
				userId,
				userName,
				operation,
				context: contextType,
			})
		} else if (contextType == 'graphql') {
			const ctx = GqlExecutionContext.create(context)
			if (ctx && ctx.getContext()) {
				const user = ctx.getContext().user
				const info = ctx.getInfo()
				const { fieldName, parentType } = info
				const operation = info.operation.operation

				let id, name
				if (user) {
					id = user.id
					name = user.name
				}

				await this.tracesModel.create({
					userId: id,
					userName: name,
					parentType,
					operation: fieldName,
					operationType: operation,
					context: contextType,
				})
			}
		}
		return next.handle()
	}
}
