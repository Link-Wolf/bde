import { Controller, Get, Session } from '@nestjs/common';
import { StudService } from './stud/stud.service';
import { LoggerService } from './logger/logger.service';

@Controller()
export class AppController {
	constructor(
		private studService: StudService,
		private logger: LoggerService,
	) { }

	@Get('session/admin')
	async getAdminSession(@Session() session: Record<string, any>) {
		if (session.login === undefined)
			return {
				clearance: session.clearance ? session.clearance : 0,
				image_url: session.image_url ? session.image_url : -42,
				login: session.login ? session.login : -42,
				firstname: session.firstname ? session.firstname : "",
				mail: session.mail ? session.mail : "",
				lastname: session.lastname ? session.lastname : "",
			};
		let stud = await this.studService.findOne(session.login, session.login);
		session.clearance = stud.clearance;
		this.logger.warn(`Updated session (admin)`, session.login)
		return {
			clearance: stud.clearance ? stud.clearance : 0,
			image_url: session.image_url ? session.image_url : -42,
			login: session.login ? session.login : -42,
			firstname: session.firstname ? session.firstname : "",
			mail: session.mail ? session.mail : "",
			lastname: session.lastname ? session.lastname : "",
		}
	}

	@Get('session')
	async getSession(@Session() session: Record<string, any>) {
		this.logger.log(`Got session`, session.login)
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
