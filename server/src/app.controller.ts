import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { getGuard } from './auth/get.guard';
import { LocalAuthGuard } from './auth/localAuth.guard';
import { Public } from './auth/public.decorator';

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly authService: AuthService) { }

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

	@Public()
	@UseGuards(LocalAuthGuard)
	@Post('auth/login')
	async login(@Request() req: any) {
		return this.authService.login(req.user);
	}
}