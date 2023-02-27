import {
	Controller, Get, Post, Patch, Delete, Session, Param, ParseIntPipe,
	UseGuards, Body
} from '@nestjs/common';
import { PingPongGameService } from './pingPongGame.service';
import { PingPongGameDto } from './pingPongGame.dto';
import { PingPongGame } from '../entity/PingPongGame';
import { ClearanceGuard } from '../auth/clearance.guard';
import { PingPongGamePipe } from './pingPongGame.pipe';

@Controller('pingPongGame/')
export class PingPongGameController 
{
    constructor(private pingPongGameService: PingPongGameService) { }

	@Get('')
	findAll(@Session() session: Record<string, any>): Promise<PingPongGame[]>
	{
		return this.pingPongGameService.findAll(session.login);
	}

	@Get(':id')
	findOne(
		@Session() session: Record<string, any>,
		@Param('id', new ParseIntPipe()) id: number
	): Promise<PingPongGame[]>
	{
		return this.pingPongGameService.findById(id, session.login);
	}

	@Get('player/:playerLogin')
	findByPlayer(
		@Session() session: Record<string, any>,
		@Param('playerLogin') playerLogin: string
	): Promise<PingPongGame[]>
	{
		return this.pingPongGameService.findByPlayer(playerLogin, session.login);
	}

	@UseGuards(new ClearanceGuard(7))
	@Post('')
	create(
		@Session() session: Record<string, any>,
		@Body(new PingPongGamePipe()) pingPongGame: PingPongGameDto
	): Promise<PingPongGame>
	{
		return this.pingPongGameService.create(pingPongGame, session.login);
	}

	// @UseGuards(new ClearanceGuard(11))
	// @Patch(':id')
	// update(
	// 	@Session() session: Record<string, any>,
	// 	@Param('id', new ParseIntPipe()) id: number,
	// 	@Body(new PingPongGamePipe()) pingPongGame: PingPongGameDto
	// ): Promise<PingPongGame>
	// {
	// 	return this.pingPongGameService.update(id, pingPongGame, session.login);
	// }

	@UseGuards(new ClearanceGuard(11))
	@Delete('')
	deleteAll(@Session() session: Record<string, any>): Promise<void>
	{
		return this.pingPongGameService.deleteAll(session.login);
	}

	@UseGuards(new ClearanceGuard(11))
	@Delete(':id')
	deleteOne(
		@Session() session: Record<string, any>,
		@Param('id', new ParseIntPipe()) id: number
	): Promise<void>
	{
		return this.pingPongGameService.deleteOne(id, session.login);
	}
}