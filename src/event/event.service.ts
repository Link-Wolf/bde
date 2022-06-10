import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThanOrEqual, Repository } from 'typeorm';
import { Event } from '../entity/Event'
import { Stud } from '../entity/Stud';
import { LoggerService } from '../logger/logger.service';
import { StudService } from '../stud/stud.service';
import { EventDto } from './event.dto';

@Injectable()
export class EventService {

	constructor(
		@InjectRepository(Event)
		private eventRepository: Repository<Event>,
		private studService: StudService,
		private logger: LoggerService,
	) { }

	findAll(): Promise<Event[]> {
		return this.eventRepository.find();
		//try catch -> err InternalServerError
	}

	findCurrent(): Promise<Event[]> {
		return this.eventRepository.findBy({
			end_date: IsNull() || MoreThanOrEqual(new Date(Date.now()))
		});
		//try catch -> err InternalServerError / if null -> warn
	}

	async findOne(id: number): Promise<Event> {
		let event = await this.eventRepository.findOneBy({ id: id });
		//try catch -> err InternalServerError
		if (!event) {
			// this.logger.warn(`No event found with id >${id}<`)
		}
		return event
	}

	async update(id: number, eventData: EventDto): Promise<void> {
		// if no event id (find) -> err NotFoundException
		try {
			await this.eventRepository.update(id, eventData);
		} catch (error) {
			// this.logger.error(`Failed to update event >${id}<`)
			throw new InternalServerErrorException()
		}
	}

	async subscribe(id: number, login: string): Promise<void> {

		let event = await this.findOne(id);
		// if (!event) {
		// 	this.logger.error(`No event found with id >${id}<`)
		// throw NotFoundException
		// }
		event.studs = await this.getStuds(id);
		try {
			event.studs.push(await this.studService.findOne(login));
		} catch (error) {
			// this.logger.error(`stud exists pas lmao`)
			throw new NotFoundException(error)
		}
		try {
			await this.eventRepository.save(event);
		} catch (error) {
			// this.logger.error(`db en pls`)
			throw new InternalServerErrorException(error)
		}
	}

	async create(eventDto: EventDto): Promise<void> {
		try {
			await this.eventRepository.save(eventDto);
		} catch (error) {
			// this.logger.error(`Failed to create event >${eventDto.name}<`)
			throw new InternalServerErrorException(error)
		}
	}

	async removeOne(id: number): Promise<void> {
		try {
			await this.eventRepository.delete({ id: id });
		} catch (error) {
			// this.logger.error(`Failed to delete event >${id}<`)
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
