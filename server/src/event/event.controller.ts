import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from '../entity/Event'
import { EventDto, EventFilterDto } from './event.dto';
import { EventDtoPipe, EventFilterDtoPipe } from './event.pipe';

@Controller('event/')
export class EventController {
	constructor(private eventService: EventService) { }

	@Get('')
	findAll(): Promise<Event[]> {
		return this.eventService.findAll(null);
	}

	@Get('current')
	findCurrent(): Promise<Event[]> {
		return this.eventService.findCurrent();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number): Promise<Event> {
		return this.eventService.findOne(id);
	}

	@Post('')
	create(@Body(new EventDtoPipe()) event: EventDto) {
		return this.eventService.create(event);
	}

	@Post('get')
	findAllButFilter(@Body(new EventFilterDtoPipe()) filters: EventFilterDto): Promise<Event[]> {
		return this.eventService.findAll(filters);
	}

	@Patch(':id')
	update(@Param('id') id: number, @Body(new EventDtoPipe()) event: EventDto) {
		return this.eventService.update(id, event);
	}

	@Patch(':id/inscription')
	subscribe(@Param('id') id: number, @Body('login') login: string) {
		return this.eventService.subscribe(id, login);
	}

	@Delete(':id')
	removeOne(@Param('id', ParseIntPipe) id: number) {
		return this.eventService.removeOne(id);
	}

	@Delete('')
	removeAll() {
		return this.eventService.removeAll();
	}
}
