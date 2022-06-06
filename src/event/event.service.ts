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

	async create(eventDto: EventDto): Promise<void> {
		const event = {
			name: eventDto.name,
			cost: Number(eventDto.cost),
			premium_cost: Number(eventDto.premium_cost || eventDto.cost),
			nb_places: Number(eventDto.nb_places),
			desc: String(eventDto.desc || eventDto.name),
			begin_date: Date(eventDto.begin_date),
			end_date: Date(eventDto.end_date)

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
