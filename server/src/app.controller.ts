import { Controller, Get, Post, Res, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService, ) { }

	@Get()
	getHello(@Res() response: any, @Req() req: any) {
		console.log('Cookies: ', req.cookies)
		console.log('Signed Cookies: ', req.signedCookies)
		response.cookie('test', 's:yeet')
		response.cookie('test2', 'yeet')
		console.log('Cookies: ', response.cookies)
		console.log('Signed Cookies: ', response.signedCookies)
	}
}
