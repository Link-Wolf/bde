import { Controller, Get, Post, Res, Req, UseGuards, Session } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/localAuth.guard';
import { Public } from './auth/public.decorator';

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly authService: AuthService) { }

	@Get()
	getHello(@Res() response: any, @Req() req: any) {
		console.log('Cookies: ', req.cookies)
		console.log('Signed Cookies: ', req.signedCookies)
		response.cookie('test', 's:yeet')
		response.cookie('test2', 'yeet')
		console.log('Cookies: ', response.cookies)
		console.log('Signed Cookies: ', response.signedCookies)
	}

	@Public()
	@UseGuards(LocalAuthGuard)
	@Post('auth/login')
	async login(@Req() req: any) {
		return this.authService.login(req.user);
	}

	@Public()
	@Get('sessionId')
	async getSessionId(@Session() session: Record<string, any>) {
		session.visit = session.visit ? session.visit + 1 : 1
		return "session id :" + session.id + " \ncame " + session.visit + " times"
	}
}
