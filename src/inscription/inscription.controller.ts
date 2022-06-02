import { Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
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

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		this.inscriptionService.remove(id);
	}
}
