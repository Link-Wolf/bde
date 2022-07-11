import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, Session } from '@nestjs/common';
import { Stud } from '../entity/Stud';
import { StudDto } from './stud.dto';
import { StudService } from './stud.service';
import { StudDtoPipe } from './stud.pipe';
import { Request, Response } from 'express';

@Controller('stud')
export class StudController {
	constructor(private studService: StudService) { }

	@Get()
	findAll(@Session() session: Record<string, any>, @Res({ passthrough: true }) response: Response, @Req() request: Request): Promise<Stud[]> {
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
		return this.studService.findAll(session.login);
	}

	@Get(':login')
	findOne(@Session() session: Record<string, any>, @Param('login') login: string): Promise<Stud> {
		return this.studService.findOne(login, session.login);
	}

	@Post()
	create(@Session() session: Record<string, any>, @Body(new StudDtoPipe()) stud: StudDto) {
		return this.studService.create(stud, session.login);
	}

	@Patch(':login')
	update(@Session() session: Record<string, any>, @Param('login') login: string, @Body(new StudDtoPipe()) stud: StudDto) {
		return this.studService.update(login, stud, session.login);
	}

	@Delete(':login')
	removeOne(@Session() session: Record<string, any>, @Param('login') login: string) {
		return this.studService.removeOne(login, session.login);
	}

	@Delete()
	removeAll(@Session() session: Record<string, any>, ) {
		return this.studService.removeAll(session.login);
	}
}
