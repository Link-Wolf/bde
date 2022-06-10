import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThanOrEqual, Repository } from 'typeorm';
import { Event } from '../entity/Event'
import { Stud } from '../entity/Stud';
import { CustomLogger } from '../logger/CustomLogger.class';
import { StudService } from '../stud/stud.service';
import { EventDto } from './event.dto';

@Injectable()
export class EventService {

	constructor(
		@InjectRepository(Event)
		private eventRepository: Repository<Event>,
		private studService: StudService,
		private readonly logger = new Logger()// CustomLogger
	) { }

	findAll(): Promise<Event[]> {
		return this.eventRepository.find();
	}

	findCurrent(): Promise<Event[]> {
		return this.eventRepository.findBy({
			end_date: IsNull() || MoreThanOrEqual(new Date(Date.now()))
		});
	}

	async findOne(id: number): Promise<Event> {
		let event = await this.eventRepository.findOneBy({ id: id });
		if (!event) {
			this.logger.warn(`No event found with id >${id}<`)
			throw new NotFoundException()
		}
		return event
	}

	async update(id: number, eventData: EventDto): Promise<void> {
		try {
			await this.eventRepository.update(id, eventData);
		} catch (error) {
			this.logger.error(`Failed to update event >${id}<`)
			throw new NotFoundException()
		}
	}

	async subscribe(id: number, login: string): Promise<void> {

		let event = await this.findOne(id);
		// if (!event) {
		// 	this.logger.warn(`No event found with id >${id}<`)
		// 	throw new NotFoundException()
		// }
		event.studs = await this.getStuds(id);
		if (!event.studs) {
			this.logger.warn(`No students found for event >${id}<`)
			throw new NotFoundException()
		}
		try {
			event.studs.push(await this.studService.findOne(login));
		} catch (error) {
			this.logger.error(`Failed to subscribe student >${login}< to event >${id}<`)
			throw new NotFoundException(error)
		}
		console.log(event);
		try {
			await this.eventRepository.save(event);
		} catch (error) {
			this.logger.error(`Failed to subscribe student >${login}< to event >${id}<`)
			throw new NotFoundException(error)
		}
	}

	async create(eventDto: EventDto): Promise<void> {
		try {
			await this.eventRepository.save(eventDto);
		} catch (error) {
			this.logger.error(`Failed to create event >${eventDto.name}<`)
			throw new NotFoundException(error)
		}
	}

	async removeOne(id: number): Promise<void> {
		try {
			await this.eventRepository.delete({ id: id });
		} catch (error) {
			this.logger.error(`Failed to delete event >${id}<`)
			throw new NotFoundException(error)
		}
	}

	async removeAll(): Promise<void> {
		await this.eventRepository.delete({});
	}

	async getStuds(id: number): Promise<Stud[]> {
		return this.eventRepository.query("SELECT * FROM stud s WHERE s.login IN (SELECT \"studLogin\" FROM inscriptions insc WHERE \"eventId\" = '" + id + "' );");
	}
}
