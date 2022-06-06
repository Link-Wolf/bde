import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { InscriptionService } from './inscription.service';

@Controller('inscription')
export class InscriptionController {
	constructor(private inscriptionService: InscriptionService) { }

	@Get()
	findAll() {
		return this.inscriptionService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.inscriptionService.findOne(id);
	}

	@Post()
	create() {
		this.inscriptionService.create();
	}

	// @Patch(':login')
	// update(@Param('login') login: string, @Body() contribution: InscriptionUpdateDto) {
	// 	this.inscriptionService.update(login, contribution);
	// }

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		this.inscriptionService.remove(id);
	}

	// @Delete()
	// removeAll() {
	// 	this.inscriptionService.removeAll();
	// }
}
