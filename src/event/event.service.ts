import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

	findOne(id: number): Promise<Event> {
		return this.eventRepository.findOneBy({ id: id });
	}

	async create(eventDto: EventDto): Promise<void> {
		const event = {
			name: eventDto.name,
			cost: Number(eventDto.cost),
			premium_cost: Number(eventDto.premium_cost || eventDto.cost),
			nb_places: Number(eventDto.nb_places)
		}
		console.log("Create the event :")
		console.log(event)
		await this.eventRepository.save(event);
	}

	async removeOne(id: number): Promise<void> {
		await this.eventRepository.delete({ id: id });
	}

	async removeAll(): Promise<void> {
		await this.eventRepository.delete({});
	}
}
