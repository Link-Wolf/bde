import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThanOrEqual, Repository } from 'typeorm';
import { Event } from '../entity/Event'
import { EventDto } from './event.dto';

@Injectable()
export class EventService {
	constructor(
		@InjectRepository(Event)
		private eventRepository: Repository<Event>,
	) { }

	findAll(): Promise<Event[]> {
		return this.eventRepository.find();
	}

	findCurrent(): Promise<Event[]> {
		return this.eventRepository.findBy({
			end_date: IsNull() || MoreThanOrEqual(new Date(Date.now()))
		});
	}

	findOne(id: number): Promise<Event> {
		return this.eventRepository.findOneBy({ id: id });
	}

	async update(id: number, eventData: EventDto): Promise<void> {
		await this.eventRepository.update(id, eventData);
	}

	async create(eventDto: EventDto): Promise<void> {
		await this.eventRepository.save(eventDto);
	}

	async removeOne(id: number): Promise<void> {
		await this.eventRepository.delete({ id: id });
	}

	async removeAll(): Promise<void> {
		await this.eventRepository.delete({});
	}
}
