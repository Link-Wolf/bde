import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Session } from '@nestjs/common';
import { InscriptionService } from './inscription.service';

@Controller('inscription')
export class InscriptionController {
	constructor(private inscriptionService: InscriptionService) { }

	@Get()
	findAll(@Session() session: Record<string, any>) {
		return this.inscriptionService.findAll(session.login);
	}

	@Get('event/:id')
	findByEvent(@Session() session: Record<string, any>, @Param('id', ParseIntPipe) id: number) {
		return this.inscriptionService.findByEvent(id, session.login);
	}

	@Get('stud/:login')
	findByStud(@Session() session: Record<string, any>, @Param('login') login: string) {
		return this.inscriptionService.findByStud(login, session.login);
	}

	@Get(':eventId/stud')
	getStudByEvent(@Session() session: Record<string, any>, @Param('eventId', ParseIntPipe) id: number) {
		return this.inscriptionService.getStudByEvent(id, session.login);
	}

	@Get(':id/isSubbed')
	getIsSubbed(@Session() session: Record<string, any>,
		@Param('id', ParseIntPipe) id: number) {
		return this.inscriptionService.getIsSubbed(id, session.login)
	}

	@Post() //body id + login
	async link(@Session() session: Record<string, any>, @Body('id', ParseIntPipe) id: number, @Body('login') login: string) {
		return this.inscriptionService.link(id, login, session.login);
	}

	@Post('me/:id')
	async subMe(
		@Session() session: Record<string, any>,
		@Param('id', ParseIntPipe) id: number) {
		return this.inscriptionService.link(id, session.login, session.login);
	}

	@Delete('event/:id')
	removeByEvent(@Session() session: Record<string, any>, @Param('id', ParseIntPipe) id: number) {
		return this.inscriptionService.removeByEvent(id, session.login);
	}

	@Delete('stud/:login')
	removeByStud(@Session() session: Record<string, any>, @Param('login') login: string) {
		return this.inscriptionService.removeByStud(login, session.login);
	}

	@Delete(':event/:login')
	remove(@Session() session: Record<string, any>, @Param('event', ParseIntPipe) event: number, @Param('login') login: string) {
		return this.inscriptionService.remove(event, login, session.login);
	}

	@Delete('me/:id')
	async unsubMe(
		@Session() session: Record<string, any>,
		@Param('id', ParseIntPipe) id: number) {
		return this.inscriptionService.remove(id, session.login, session.login);
	}

	@Delete('/admin/:event/:login')
	forceRemove(@Session() session: Record<string, any>, @Param('event', ParseIntPipe) event: number, @Param('login') login: string) {
		return this.inscriptionService.forceRemove(event, login, session.login);
	}

	@Delete()
	removeAll(@Session() session: Record<string, any>) {
		return this.inscriptionService.removeAll(session.login);
	}
}
