import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from '../entity/Event'
import { EventDto } from './event.dto';

@Controller('event')
export class EventController {
	constructor(private eventService: EventService) { }

	@Get()
	findCurrent(): Promise<Event[]> {
		return this.eventService.findCurrent();
	}

	@Get('all')
	findAll(): Promise<Event[]> {
		return this.eventService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number): Promise<Event> {
		return this.eventService.findOne(id);
	}

	@Post()
	create(@Body() event: EventDto) {
		this.eventService.create(event);
	}

	@Delete(':id')
	removeOne(@Param('id', ParseIntPipe) id: number) {
		this.eventService.removeOne(id);
	}

	@Delete()
	removeAll() {
		this.eventService.removeAll();
	}
}
