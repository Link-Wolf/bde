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

	async findAll(): Promise<Event[]> {
		try {
			let events = await this.eventRepository.find();
			if (events.length == 0)
				this.logger.warn(`No events found `)
			else
				this.logger.log(`Find events`);
			return events;
		} catch (error) {
			this.logger.error(`Could not find events: ${error}`);
			throw new InternalServerErrorException(`Could not find events: ${error}`)
		}
	}

	async findCurrent(): Promise<Event[]> {
		try {
			let events = await this.eventRepository.findBy({
				end_date: IsNull() || MoreThanOrEqual(new Date(Date.now()))
			});
			if (events.length == 0)
				this.logger.warn(`No current events found `)
			else
				this.logger.log(`Find curent events`);
			return events;
		} catch (error) {
			this.logger.error(`Could not find events: ${error}`);
			throw new InternalServerErrorException(`Could not find events: ${error}`)
		}
	}

	async findOne(id: number): Promise<Event> {
		try {
			let event = await this.eventRepository.findOneBy({ id: id });
			if (!event)
				this.logger.warn(`No event ${id} found `)
			else
				this.logger.log(`Find event ${id}`);
			return event;
		} catch (error) {
			this.logger.error(`Could not find event ${id}: ${error}`);
			throw new InternalServerErrorException(`Could not find event ${id}: ${error}`)
		}
	}

	async update(id: number, eventData: EventDto): Promise<void> {
		// if no event id (find) -> err NotFoundException
		try {
			if (!await this.findOne(id)) {
				this.logger.error(`No event ${id}`);
				throw new NotFoundException(`No event ${id}`);
			}
			await this.eventRepository.update(id, eventData);
			this.logger.log(`Update event ${id}`);
		} catch (error) {
			this.logger.error(`Failed to update event ${id} : ${error}`)
			throw new InternalServerErrorException(`Failed to update event ${id} : ${error}`)
		}
	}

	async subscribe(id: number, login: string): Promise<void> {
		try {
			let event = await this.findOne(id);
			if (!event) {
				this.logger.error(`No event found`)
				throw new NotFoundException(`No event found`)
			}
			event.studs = await this.getStuds(id);
			let stud = await this.studService.findOne(login);
			if (!stud) {
				this.logger.error(`No user found`)
				throw new NotFoundException(`No user found`)
			}
			event.studs.push(stud);
			await this.eventRepository.save(event);
			this.logger.log(`Subscribe user ${login} to event ${id}`);
		} catch (error) {
			this.logger.error(`Could not subscribe stud ${login} to event ${id}: ${error}`)
			throw new InternalServerErrorException(`Could not subscribe stud ${login} to event ${id}: ${error}`)
		}
	}

	async create(eventDto: EventDto): Promise<void> {
		try {
			await this.eventRepository.save(eventDto);
			this.logger.log(`Create new event`);
		} catch (error) {
			this.logger.error(`Failed to create event ${eventDto.name}: ${error}`)
			throw new InternalServerErrorException(`Failed to create event ${eventDto.name}: ${error}`)
		}
	}

	async removeOne(id: number): Promise<void> {
		try {
			if (await this.findOne(id)) {
				await this.eventRepository.delete({ id: id });
				this.logger.log(`Delete event ${id}`);
			}
		} catch (error) {
			this.logger.error(`Failed to delete event ${id}: ${error}`)
			throw new InternalServerErrorException(`Failed to delete event ${id}: ${error}`)
		}
	}

	async removeAll(): Promise<void> {
		try {
			await this.eventRepository.delete({});
			this.logger.log(`Delete all events`);
		} catch (error) {
			this.logger.error(`Failed to delete events: ${error}`)
			throw new InternalServerErrorException(`Failed to delete events: ${error}`)
		}
	}

	async getStuds(id: number): Promise<Stud[]> {
		return this.eventRepository.query("SELECT * FROM stud s WHERE s.login IN (SELECT \"studLogin\" FROM inscriptions insc WHERE \"eventId\" = '" + id + "' );");
	}
}
