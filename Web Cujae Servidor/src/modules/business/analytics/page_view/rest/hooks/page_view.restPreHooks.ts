import { PreHooksRestFunctions } from '@regiondev/nestjs-common';
import uap from "ua-parser-js";
import { PageView } from '../../models/page_view.model';
import { PageViewService } from '../../page_view.service';

export function page_viewPreHooks(page_viewService: PageViewService): PreHooksRestFunctions<PageView> {
	return {
		async create(params) {
			const { input, req } = params
			const ua = req.headers['user-agent']
			const ip = req.headers['X-Forwarded-For'] as string
			const { browser, os } = uap(ua);
			const data: PageView = input.data as any
			data.ip = ip ?? req.ip
			data.browser = browser?.name
			data.os = os?.name
			data.http_user_agent = ua

			if (data.ip === '::1') {
				data.ip = '152.207.59.81'
			}

			const country_code = await page_viewService.getCountryCode(data.ip)
			if (country_code)
				data.country_code = country_code

			input.data = data

			return input
		},
	}
}
