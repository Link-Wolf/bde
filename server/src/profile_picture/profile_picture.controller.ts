import { Controller, Get, Param, Session } from '@nestjs/common';

@Controller('profile-picture')
export class ProfilePictureController {
	@Get(':login')
	getLogin(@Param('login') login: string, @Session() session: Record<string, any>) {
		// this.profilePictureService.getPP(login, session.login);
	}
}
