import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Inscription } from './inscription.entity';
import { InscriptionService } from './inscription.service';

@Controller('inscription')
export class InscriptionController {
	constructor(private inscriptionService: InscriptionService) { }

	@Get()
	findAll(): Promise<Inscription[]> {
		return this.inscriptionService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number): Promise<Inscription> {
		return this.inscriptionService.findOne(id);
	}

	@Post()
	create(@Body() inscription: Inscription) {
		this.inscriptionService.create(inscription);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		this.inscriptionService.remove(id);
	}
}
