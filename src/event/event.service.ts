import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThanOrEqual, Repository } from 'typeorm';
import { Event } from '../entity/Event'
import { StudService } from '../stud/stud.service';
import { EventDto } from './event.dto';

@Injectable()
export class EventService {
	constructor(
		@InjectRepository(Event)
		private eventRepository: Repository<Event>,
		private studService: StudService
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

	async update(id: number, eventData: any): Promise<void> {
		await this.eventRepository.update(id, eventData);
	}

	async subscribe(id: number, login: string): Promise<void> {
		// let event = await this.findOne(id)
		// event.subscribe(await this.studService.findOne(login))
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
