import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Session } from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from '../entity/Event'
import { EventDto, EventFilterDto } from './event.dto';
import { EventDtoPipe, EventFilterDtoPipe } from './event.pipe';

@Controller('event/')
export class EventController {
	constructor(private eventService: EventService) { }

	@Get('')
	findAll(@Session() session: Record<string, any>): Promise<Event[]> {
		return this.eventService.findAll(null, session.login);
	}

	@Get('current')
	findCurrent(@Session() session: Record<string, any>): Promise<Event[]> {
		return this.eventService.findCurrent(session.login);
	}

	@Get(':id')
	findOne(@Session() session: Record<string, any>, @Param('id', ParseIntPipe) id: number): Promise<Event> {
		return this.eventService.findOne(id, session.login);
	}

	@Post('')
	create(@Session() session: Record<string, any>, @Body(new EventDtoPipe()) event: EventDto) {
		return this.eventService.create(event, session.login);
	}

	@Post('get')
	findAllButFilter(@Body(new EventFilterDtoPipe()) filters: EventFilterDto, @Session() session: Record<string, any>): Promise<Event[]> {
		return this.eventService.findAll(filters, session.login);
	}

	@Patch(':id')
	update(@Session() session: Record<string, any>, @Param('id') id: number, @Body(new EventDtoPipe()) event: EventDto) {
		return this.eventService.update(id, event, session.login);
	}

	@Patch(':id/inscription')
	subscribe(@Session() session: Record<string, any>, @Param('id') id: number, @Body('login') login: string) {
		return this.eventService.subscribe(id, login, session.login);
	}

	@Patch('admin/:id/inscription')
	forceSubscribe(@Session() session: Record<string, any>, @Param('id') id: number, @Body('login') login: string) {
		return this.eventService.forceSubscribe(id, login, session.login);
	}

	@Delete(':id')
	removeOne(@Session() session: Record<string, any>, @Param('id', ParseIntPipe) id: number) {
		return this.eventService.removeOne(id, session.login);
	}

	@Delete('')
	removeAll(@Session() session: Record<string, any>) {
		return this.eventService.removeAll(session.login);
	}
}
