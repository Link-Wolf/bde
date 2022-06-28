import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { InscriptionService } from './inscription.service';

@Controller('inscription')
export class InscriptionController {
	constructor(private inscriptionService: InscriptionService) { }

	@Get()
	findAll() {
		return this.inscriptionService.findAll();
	}

	@Get('event/:id')
	findByEvent(@Param('id', ParseIntPipe) id: number) {
		return this.inscriptionService.findByEvent(id);
	}

	@Get('stud/:login')
	findByStud(@Param('login') login: string) {
		return this.inscriptionService.findByStud(login);
	}

	@Post() //body id + login
	async link(@Body('id', ParseIntPipe) id: number, @Body('login') login: string) {
		return this.inscriptionService.link(id, login);
	}

	@Delete('event/:id')
	removeByEvent(@Param('id', ParseIntPipe) id: number) {
		return this.inscriptionService.removeByEvent(id);
	}

	@Delete('stud/:login')
	removeByStud(@Param('login') login: string) {
		return this.inscriptionService.removeByStud(login);
	}

	@Delete(':event/:login')
	remove(@Param('event', ParseIntPipe) event: number, @Param('login') login: string) {
		return this.inscriptionService.remove(event, login);
	}

	@Delete('/admin/:event/:login')
	forceRemove(@Param('event', ParseIntPipe) event: number, @Param('login') login: string) {
		return this.inscriptionService.forceRemove(event, login);
	}

	@Delete()
	removeAll() {
		return this.inscriptionService.removeAll();
	}
}
