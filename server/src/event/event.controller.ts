import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req } from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from '../entity/Event'
import { EventDto, EventFilterDto } from './event.dto';
import { EventDtoPipe, EventFilterDtoPipe } from './event.pipe';

@Controller('event/')
export class EventController {
	constructor(private eventService: EventService) { }

	@Get('')
	findAll(@Req() req: any): Promise<Event[]> {
		return this.eventService.findAll(null, req.user.login);
	}

	@Get('current')
	findCurrent(@Req() req: any): Promise<Event[]> {
		return this.eventService.findCurrent(req.user.login);
	}

	@Get(':id')
	findOne(@Req() req: any, @Param('id', ParseIntPipe) id: number): Promise<Event> {
		return this.eventService.findOne(id, req.user.login);
	}

	@Post('')
	create(@Req() req: any, @Body(new EventDtoPipe()) event: EventDto) {
		return this.eventService.create(event, req.user.login);
	}

	@Post('get')
	findAllButFilter(@Body(new EventFilterDtoPipe()) filters: EventFilterDto, @Req() req: any): Promise<Event[]> {
		return this.eventService.findAll(filters, req.user.login);
	}

	@Patch(':id')
	update(@Req() req: any, @Param('id') id: number, @Body(new EventDtoPipe()) event: EventDto) {
		return this.eventService.update(id, event, req.user.login);
	}

	@Patch(':id/inscription')
	subscribe(@Req() req: any, @Param('id') id: number, @Body('login') login: string) {
		return this.eventService.subscribe(id, login, req.user.login);
	}

	@Patch('admin/:id/inscription')
	forceSubscribe(@Req() req: any, @Param('id') id: number, @Body('login') login: string) {
		return this.eventService.forceSubscribe(id, login, req.user.login);
	}

	@Delete(':id')
	removeOne(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
		return this.eventService.removeOne(id, req.user.login);
	}

	@Delete('')
	removeAll(@Req() req: any) {
		return this.eventService.removeAll(req.user.login);
	}
}
