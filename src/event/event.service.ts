import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThanOrEqual, Repository } from 'typeorm';
import { Event } from '../entity/Event'
import { Stud } from '../entity/Stud';
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

	async update(id: number, eventData: EventDto): Promise<void> {
		if (!(await this.findOne(id))) {
			//ERROR: there is no event with id ${id}
		}
		await this.eventRepository.update(id, eventData);
	}

	async subscribe(id: number, login: string): Promise<void> {
		let event = await this.findOne(id);
		if (!event) {
			//ERROR: there is no event with id ${id}
		}
		let stud = await this.studService.findOne(login);
		if (!stud) {
			//ERROR: there is no student ${login}
		}
		event.studs = await this.getStuds(id);
		event.studs.push(stud);
		console.log(event);
		await this.eventRepository.save(event);
	}

	async create(eventDto: EventDto): Promise<void> {
		await this.eventRepository.save(eventDto);
	}

	async removeOne(id: number): Promise<void> {
		if (!(await this.findOne(id))) {
			//ERROR: there is no event with id ${id}
		}
		await this.eventRepository.delete({ id: id });
	}

	async removeAll(): Promise<void> {
		await this.eventRepository.delete({});
	}

	async getStuds(id: number): Promise<Stud[]> {
		if (!(await this.findOne(id))) {
			//ERROR: there is no event with id ${id}
		}
		return this.eventRepository.query("SELECT * FROM stud s WHERE s.login IN (SELECT \"studLogin\" FROM inscriptions insc WHERE \"eventId\" = '" + id + "' );");
	}
}
