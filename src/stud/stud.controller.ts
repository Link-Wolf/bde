import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Stud } from '../entity/Stud';
import { StudDto } from './stud.dto';
import { StudService } from './stud.service';
import { StudDtoPipe } from './stud.pipe';
import { getGuard } from '../auth/get.guard';
import { Public } from '../auth/public.decorator';

@Controller('stud')
export class StudController {
	constructor(private studService: StudService) { }

	@UseGuards(getGuard)
	@Get()
	findAll(): Promise<Stud[]> {
		return this.studService.findAll();
	}

	@Get(':login')
	findOne(@Param('login') login: string): Promise<Stud> {
		return this.studService.findOne(login);
	}

	@Public()
	@Post()
	create(@Body(new StudDtoPipe()) stud: StudDto) {
		return this.studService.create(stud);
	}

	@Patch(':login')
	update(@Param('login') login: string, @Body(new StudDtoPipe()) stud: StudDto) {
		return this.studService.update(login, stud);
	}

	@Delete(':login')
	removeOne(@Param('login') login: string) {
		return this.studService.removeOne(login);
	}

	@Delete()
	removeAll() {
		return this.studService.removeAll();
	}
}
