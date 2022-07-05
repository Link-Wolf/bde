import { Controller, Get, Param, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) { }

	@Post()
	getToken(@Body('code') code: string) {
		return this.authService.getToken(code)
	}
}
