import { Controller, Get, Param, Body, Post, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) { }

	@Public()
	@Post()
	async loginIntra(@Body('code') code: string, @Session() session: Record<string, any>) {
		let ret = await this.authService.loginIntra(code)
		session.login = ret.login
		session.clearance = ret.clearance
		session.image_url = ret.image_url
		return { login: ret.login }
	}
}
