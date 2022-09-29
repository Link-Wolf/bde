import { Controller, Get, Session } from '@nestjs/common';

@Controller()
export class AppController {
	@Get('session')
	async getSession(@Session() session: Record<string, any>) {
		return {
			clearance: session.clearance ? session.clearance : 0,
			image_url: session.image_url ? session.image_url : -42,
			login: session.login ? session.login : -42,
			firstname: session.firstname ? session.firstname : "",
			mail: session.mail ? session.mail : "",
			lastname: session.lastname ? session.lastname : "",
		}
	}
}
