/*
https://docs.nestjs.com/providers#services
*/

import { Global, Injectable } from '@nestjs/common'

@Injectable()
@Global()
export class AppService {}
