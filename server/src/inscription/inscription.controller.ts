import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Req } from '@nestjs/common';
import { InscriptionService } from './inscription.service';

@Controller('inscription')
export class InscriptionController {
	constructor(private inscriptionService: InscriptionService) { }

	@Get()
	findAll(@Req() req: any) {
		return this.inscriptionService.findAll(req.user.login);
	}

	@Get('event/:id')
	findByEvent(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
		return this.inscriptionService.findByEvent(id, req.user.login);
	}

	@Get('stud/:login')
	findByStud(@Req() req: any, @Param('login') login: string) {
		return this.inscriptionService.findByStud(login, req.user.login);
	}

	@Get(':eventId/stud')
	getStudByEvent(@Req() req: any, @Param('eventId', ParseIntPipe) id: number) {
		return this.inscriptionService.getStudByEvent(id, req.user.login);
	}

	@Post() //body id + login
	async link(@Req() req: any, @Body('id', ParseIntPipe) id: number, @Body('login') login: string) {
		return this.inscriptionService.link(id, login, req.user.login);
	}

	@Delete('event/:id')
	removeByEvent(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
		return this.inscriptionService.removeByEvent(id, req.user.login);
	}

	@Delete('stud/:login')
	removeByStud(@Req() req: any, @Param('login') login: string) {
		return this.inscriptionService.removeByStud(login, req.user.login);
	}

	@Delete(':event/:login')
	remove(@Req() req: any, @Param('event', ParseIntPipe) event: number, @Param('login') login: string) {
		return this.inscriptionService.remove(event, login, req.user.login);
	}

	@Delete('/admin/:event/:login')
	forceRemove(@Req() req: any, @Param('event', ParseIntPipe) event: number, @Param('login') login: string) {
		return this.inscriptionService.forceRemove(event, login, req.user.login);
	}

	@Delete()
	removeAll(@Req() req: any) {
		return this.inscriptionService.removeAll(req.user.login);
	}
}
