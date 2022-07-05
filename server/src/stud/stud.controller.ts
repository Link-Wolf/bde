import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { Stud } from '../entity/Stud';
import { StudDto } from './stud.dto';
import { StudService } from './stud.service';
import { StudDtoPipe } from './stud.pipe';
import { Request, Response } from 'express';
import { Public } from '../auth/public.decorator';

@Controller('stud')
export class StudController {
	constructor(private studService: StudService) { }

	@Get()
	findAll(@Res({ passthrough: true }) response: Response, @Req() request: Request): Promise<Stud[]> {
		console.log("cookie : ");
		console.log(request.cookies);
		console.log(" : end cookie")
		//console.log("signed cookie :" + request.signedCookies)
		//response.cookie('test', 's:yeet')
		response.cookie('test', 'yeet')
		console.log("cookie 2: ");
		console.log(request.cookies);
		console.log(" : end cookie 2")
		//console.log("signed cookie 2:" + request.signedCookies)
		return this.studService.findAll();
	}

	@Get(':login')
	findOne(@Param('login') login: string): Promise<Stud> {
		return this.studService.findOne(login);
	}

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
