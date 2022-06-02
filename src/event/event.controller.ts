import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from '../entity/Event'

@Controller('event')
export class EventController {
	constructor(private eventService: EventService) { }

	@Get()
	findAll(): Promise<Event[]> {
		return this.eventService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number): Promise<Event> {
		return this.eventService.findOne(id);
	}

	@Post()
	create(@Body() event: Event) {
		this.eventService.create(event);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		this.eventService.remove(id);
	}
}
