import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwtAuth.guard';
import { LocalAuthGuard } from './auth/localAuth.guard';

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly authService: AuthService) { }

	@UseGuards(JwtAuthGuard)
	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

	@UseGuards(LocalAuthGuard)
	@Post('auth/login')
	async login(@Request() req:any) {
		console.log(req);
		return this.authService.login(req.user);
	}
}
