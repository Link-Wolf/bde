import { Controller, Get, Post, Req, Session, Body, NotFoundException } from '@nestjs/common';
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
	async getImageUrl(@Session() session: Record<string, any>) {		// console.log(session.image_url)
		return session.image_url ? { image_url: session.image_url } : { image_url: "-42" }
	}

	@Get('clearance')
	async getClearance(@Session() session: Record<string, any>) {		// console.log(session.image_url)
		return session.clearance ? { clearance: session.clearance } : { clearance: "-42" }
	}
}
