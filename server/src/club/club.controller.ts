import {
	Controller, Delete, Get, Param, ParseIntPipe, Patch, Post,
	Session, UseGuards, Body
} from '@nestjs/common';
import { ClubService } from './club.service';
import { Club } from '../entity/Club'
import { ClubDto } from './club.dto';
import { ClubDtoPipe } from './club.pipe';

import { ClearanceGuard } from '../auth/clearance.guard';

@Controller('club/')
@UseGuards(new ClearanceGuard(5))
export class ClubController {
	constructor(private clubService: ClubService) { }

	@Get('')
	findAll(@Session() session: Record<string, any>): Promise<Club[]> {
		return this.clubService.findAll(session.login);
	}

	@Get(':id')
	@UseGuards(new ClearanceGuard(5))
	findOne(@Session() session: Record<string, any>, @Param('id') id: number): Promise<Club> {
		return this.clubService.findOne(id, session.login);
	}

	@Post('')
	@UseGuards(new ClearanceGuard(11))
	create(
		@Session() session: Record<string, any>, @Body(ClubDtoPipe) club: ClubDto) {
		return this.clubService.create(club, session.login);
	}

	@Patch(':id')
	@UseGuards(new ClearanceGuard(11))
	update(
		@Session() session: Record<string, any>, @Param('id') id: number, @Body(ClubDtoPipe) club: ClubDto) {
		return this.clubService.update(id, club, session.login);
	}

	@Delete(':id')
	@UseGuards(new ClearanceGuard(11))
	removeOne(
		@Session() session: Record<string, any>,
		@Param('id', ParseIntPipe) id: number) {
		return this.clubService.removeOne(id, session.login);
	}

	@Delete('')
	@UseGuards(new ClearanceGuard(11))

	removeAll(@Session() session: Record<string, any>) {
		return this.clubService.removeAll(session.login);
	}
}
