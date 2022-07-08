import { Controller, Get, Session } from '@nestjs/common';
import { Public } from './auth/public.decorator';

@Controller()
export class AppController {
	@Public()
	@Get('sessionId')
	async getSessionId(@Session() session: Record<string, any>) {
		session.visit = session.visit ? session.visit + 1 : 1
		return "session id :" + session.id + " \ncame " + session.visit + " times"
	}
}
