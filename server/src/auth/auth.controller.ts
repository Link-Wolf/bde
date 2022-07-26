import { Controller, Get, Param, Body, Post, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) { }

	@Public()
	@Post()
	async loginIntra(@Body('code') code: string, @Session() session: Record<string, any>) {
		let ret = await this.authService.loginIntra(code);
		await (session.login = ret.login);
		await (session.clearance = ret.clearance);
		await (session.image_url = ret.image_url);
		await (session.save());
		return {
			login: session.login
		};
	}

	@Public()
	@Get('logout')
	async logout(@Session() session: Record<string, any>) {
		await (session.destroy());
	}
}
