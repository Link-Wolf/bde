import { Controller, Get, Param, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) { }

	@Public()
	@Post()
	loginIntra(@Body('code') code: string) {
		return this.authService.loginIntra(code)
	}
}
