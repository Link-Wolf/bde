import { Controller, Get, Session } from '@nestjs/common';
import { StudService } from './stud/stud.service';

@Controller()
export class AppController {
	constructor(private studService: StudService) { }

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

	@Get('session/admin')
	async getAdminSession(@Session() session: Record<string, any>) {
		let stud = await this.studService.findOne(session.login, session.login);
		session.clearance = stud.clearance;
		return {
			clearance: stud.clearance ? stud.clearance : 0,
			image_url: session.image_url ? session.image_url : -42,
			login: session.login ? session.login : -42,
			firstname: session.firstname ? session.firstname : "",
			mail: session.mail ? session.mail : "",
			lastname: session.lastname ? session.lastname : "",
		}
	}
}
