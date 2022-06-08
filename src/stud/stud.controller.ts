import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes } from '@nestjs/common';
import { Stud } from '../entity/Stud';
import { StudDto } from './stud.dto';
import { StudService } from './stud.service';
import { StudDtoPipe } from './stud.pipe';

@Controller('stud')
export class StudController {
	constructor(private studService: StudService) { }

	@Get()
	findAll(): Promise<Stud[]> {
		return this.studService.findAll();
	}

	@Get(':login')
	findOne(@Param('login') login: string): Promise<Stud> {
		return this.studService.findOne(login);
	}

	@Post()
	create(@Body(new StudDtoPipe()) stud: StudDto) {
		this.studService.create(stud);
	}

	@Patch(':login')
	update(@Param('login') login: string, @Body(new StudDtoPipe()) stud: StudDto) {
		this.studService.update(login, stud);
	}

	@Delete(':login')
	removeOne(@Param('login') login: string) {
		this.studService.removeOne(login);
	}

	@Delete()
	removeAll() {
		this.studService.removeAll();
	}
}
