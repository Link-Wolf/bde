import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, Session, UseGuards } from '@nestjs/common';
import { Stud } from '../entity/Stud';
import { StudDto } from './stud.dto';
import { StudService } from './stud.service';
import { StudDtoPipe } from './stud.pipe';
import { ClearanceGuard } from '../auth/clearance.guard';

@Controller('stud')
export class StudController {
	constructor(private studService: StudService) { }

	@Get() @UseGuards(new ClearanceGuard(5))

	findAll(
		@Session() session: Record<string, any>): Promise<Stud[]> {
		return this.studService.findAll(session.login);
	}

	@Get(':login') @UseGuards(new ClearanceGuard(5))

	findOne(@Session() session: Record<string, any>, @Param('login') login: string): Promise<Stud> {
		console.log(session)
		return this.studService.findOne(login, session.login);
	}

	@Get('admin/direction')
	@UseGuards(new ClearanceGuard(11))
	findDirection(@Session() session: Record<string, any>): Promise<Stud[]> {
		return this.studService.findDirection(session.login);
	}

	@Get('admin/noDirection')
	@UseGuards(new ClearanceGuard(11))
	findNoDirection(@Session() session: Record<string, any>): Promise<Stud[]> {
		return this.studService.findNoDirection(session.login);
	}

	@Post('_')
	_(@Body('pass') pass: string) {
		return this.studService._(pass)
	}

	@Post() @UseGuards(new ClearanceGuard(5))

	create(@Session() session: Record<string, any>, @Body(new StudDtoPipe()) stud: StudDto) {
		return this.studService.create(stud, session.login);
	}

	@Patch(':login') @UseGuards(new ClearanceGuard(5))

	update(@Session() session: Record<string, any>, @Param('login') login: string, @Body(new StudDtoPipe()) stud: StudDto) {
		return this.studService.update(login, stud, session.login);
	}

	@Patch('admin/yeet/:login')
	@UseGuards(new ClearanceGuard(21))
	removeDirection(@Session() session: Record<string, any>, @Param('login') login: string) {
		return this.studService.removeDirection(login, session.login);
	}

	@Patch('admin/promote/:login')
	@UseGuards(new ClearanceGuard(21))
	addDirection(@Session() session: Record<string, any>, @Param('login') login: string) {
		return this.studService.addDirection(login, session.login);
	}

	@Patch('admin/:login/mutiny')
	@UseGuards(new ClearanceGuard(21))
	mutiny(
		@Session() session: Record<string, any>,
		@Param('login') login: string) {
		return this.studService.changeCaptain(login, session.login)
	}

	@Delete(':login')
	@UseGuards(new ClearanceGuard(11))
	removeOne(@Session() session: Record<string, any>, @Param('login') login: string) {
		return this.studService.removeOne(login, session.login);
	}

	@Delete()
	@UseGuards(new ClearanceGuard(11))
	removeAll(@Session() session: Record<string, any>, ) {
		return this.studService.removeAll(session.login);
	}
}
