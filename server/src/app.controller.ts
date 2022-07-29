import { Controller, Get, Post, Patch, Session, Body, NotFoundException } from '@nestjs/common';
import { Public } from './auth/public.decorator';

@Controller()
export class AppController {
	@Public()
	@Get('sessionId')
	async getSessionId(@Session() session: Record<string, any>) {
		session.visit = session.visit ? session.visit + 1 : 1
		return "session id :" + session.id + " \ncame " + session.visit + " times"
	}

	@Get('sessionId2')
	async getSessionId2(@Session() session: Record<string, any>) {
		session.visit = session.visit ? session.visit + 1 : 1
		return "session id :" + session.id + " \ncame " + session.visit + " times"
	}

	@Post('sessionLogin')
	async postSessionLogin(@Body('login') login: string, @Session() session: Record<string, any>) {
		session.login = login;
		return ":)"
	}

	@Get('sessionLogin')
	async getSessionLogin(@Session() session: Record<string, any>) {
		return session.login ? session.login : new NotFoundException(`Error Login session fucker`);
	}

	@Get('image_url')
	async getImageUrl(@Session() session: Record<string, any>) {
		return session.image_url ? { image_url: session.image_url } : { image_url: "-42" }
	}

	@Get('clearance')
	async getClearance(@Session() session: Record<string, any>) {
		return session.clearance ? { clearance: session.clearance } : { clearance: "-42" }
	}

	@Get('theme')
	async getTheme(@Session() session: Record<string, any>) {
		if (!session.theme)
			session.theme = "light"
		return { theme: session.theme }
	}

	@Patch('theme')
	async toggleTheme(@Session() session: Record<string, any>) {
		session.theme = session.theme === "light" ? "dark" : "light";
	}

	@Get('session')
	async getSession(@Session() session: Record<string, any>) {
		console.log(session);
		return {
			clearance: session.clearance ? session.clearance : 0,
			image_url: session.image_url ? session.image_url : -42,
			login: session.login ? session.login : -42
		}
	}
}
