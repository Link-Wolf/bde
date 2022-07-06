import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThanOrEqual, Repository } from 'typeorm';
import { Event } from '../entity/Event'
import { Stud } from '../entity/Stud';
import { LoggerService } from '../logger/logger.service';
import { StudService } from '../stud/stud.service';
import { EventDto, EventFilterDto } from './event.dto';

@Injectable()
export class EventService {

	constructor(
		@InjectRepository(Event)
		private eventRepository: Repository<Event>,
		private studService: StudService,
		private logger: LoggerService,
	) { }

	async findAll(filterDto: EventFilterDto, requestMaker: string): Promise<Event[]> {
		try {
			let match = `SELECT * FROM "event" WHERE '1' = '1'`;
			if (filterDto.current)
				match += ` AND ("end_date" IS NULL OR "end_date" > 'NOW()')`
			if (filterDto.free)
				match += ` AND "cost" = 0`
			if (filterDto.available)
				match += ` AND ("nb_places" > (SELECT COUNT(*) FROM "inscriptions" WHERE "eventId" = event.id) OR "nb_places" < 0)`
			if (filterDto.food)
				match += ` AND "consos" = 't'`
			if (filterDto.unlimited)
				match += ` AND "nb_places" = -42`
			if (filterDto.outside)
				match += ` AND "isOutside" = 't'`
			if (filterDto.sponsorised)
				match += ` AND "sponsorised" = 't'`
			match += ` ORDER BY ${filterDto.sort} ${filterDto.asc ? "ASC" : "DESC"}`
			match += `;`
			let events = await this.eventRepository.query(match);
			// if (events.length == 0)			// 	this.logger.warn(`No events found`)
			// else
			this.logger.log(`Got all filtered events`, requestMaker);
			return events;
		} catch (error) {
			this.logger.error(`Failed to get all filtered events on database(${error})`, requestMaker);
			throw new InternalServerErrorException(`Could not find filtered events on database(${error})`)
		}
	}

	async findCurrent(requestMaker: string): Promise<Event[]> {
		try {
			let events = await this.eventRepository.findBy({
				end_date: IsNull() || MoreThanOrEqual(new Date(Date.now()))
			});
			// if (events.length == 0)
			// 	this.logger.warn(`No current events found`)
			// else
			this.logger.log(`Got all current events`, requestMaker);
			return events;
		} catch (error) {
			this.logger.error(`Failed to get all current events on database(${error})`, requestMaker);
			throw new InternalServerErrorException(`Failed to get all current events on database(${error})`)
		}
	}

	async findOne(id: number, requestMaker: string): Promise<Event> {
		try {
			let event = await this.eventRepository.findOneBy({ id: id });
			if (event)
				// 	this.logger.warn(`Failed to find event with id ${ id } : event does not exist`)
				// else
				this.logger.log(`Got event with id ${id} `, requestMaker);
			return event;
		} catch (error) {
			this.logger.error(`Failed to find event ${id} on database(${error})`, requestMaker);
			throw new InternalServerErrorException(`Failed to find event ${id} on database(${error})`)
		}
	}

	async update(id: number, eventData: EventDto, requestMaker: string): Promise<void> {
		// if no event id (find) -> err NotFoundException
		try {
			if (!await this.findOne(id, requestMaker)) {
				this.logger.error(`Failed to update event with id ${id} : event does not exist`, requestMaker);
				throw new NotFoundException(`Failed to update event with id ${id} : event does not exist`);
			}
			await this.eventRepository.update(id, eventData);
			this.logger.warn(`Successfully updated event ${id} `, requestMaker);
		} catch (error) {
			this.logger.error(`Failed to update event ${id} on database(${error})`, requestMaker)
			throw new InternalServerErrorException(`Failed to update event ${id} on database(${error})`)
		}
	}

	async subscribe(id: number, login: string, requestMaker: string): Promise<void> {
		try {
			let event = await this.findOne(id, requestMaker);
			if (!event) {
				this.logger.error(`Failed to subscribe student ${login} to event ${id} : event does not exist`, requestMaker)
				throw new NotFoundException(`Failed to subscribe student ${login} to event ${id} : event does not exist`)
			}
			event.studs = await this.getStuds(id, requestMaker);
			let stud = await this.studService.findOne(login, requestMaker);
			if (!stud) {
				this.logger.error(`Failed to subscribe student ${login} to event ${id} : student does not exist`, requestMaker)
				throw new NotFoundException(`Failed to subscribe student ${login} to event ${id} : student does not exist`)
			}
			event.studs.push(stud);
			await this.eventRepository.save(event);
			this.logger.log(`Successfully subscribe student ${login} to event ${id} `, requestMaker);
		} catch (error) {
			this.logger.error(`Failed to subscribe student ${login} to event ${id} on database(${error})`, requestMaker)
			throw new InternalServerErrorException(`Failed to subscribe student ${login} to event ${id} on database(${error})`)
		}
	}

	async forceSubscribe(id: number, login: string, requestMaker: string): Promise<void> {
		try {
			let event = await this.findOne(id, requestMaker);
			if (!event) {
				this.logger.error(`Failed to force subscribe student ${login} to event ${id} : event does not exist`, requestMaker)
				throw new NotFoundException(`Failed to force subscribe student ${login} to event ${id} : event does not exist`)
			}
			event.studs = await this.getStuds(id, requestMaker);
			let stud = await this.studService.findOne(login, requestMaker);
			if (!stud) {
				// this.logger.error(`Failed to force subscribe student ${login} to event ${id} : student does not exist`, requestMaker)
				throw new NotFoundException(`Failed to force subscribe student ${login} to event ${id} : student does not exist`)
			}
			event.studs.push(stud);
			await this.eventRepository.save(event);
			this.logger.warn(`Successfully force subscribe student ${login} to event ${id} `, requestMaker);
		} catch (error) {
			// this.logger.error(`Failed to force subscribe student ${login} to event ${id} on database(${error})`, requestMaker)
			// throw new InternalServerErrorException(`Failed to force subscribe student ${login} to event ${id} on database(${error})`)
			throw error;
		}
	}

	async create(eventDto: EventDto, requestMaker: string): Promise<void> {
		try {
			await this.eventRepository.save(eventDto);
			this.logger.warn(`Successfully created new event ${eventDto.name} `, requestMaker);
		} catch (error) {
			this.logger.error(`Failed to create event ${eventDto.name} on database(${error})`, requestMaker)
			throw new InternalServerErrorException(`Failed to create event ${eventDto.name} on database(${error})`)
		}
	}

	async removeOne(id: number, requestMaker: string): Promise<void> {
		try {
			if (await this.findOne(id, requestMaker)) {
				await this.eventRepository.delete({ id: id });
				this.logger.warn(`Successfully deleted event ${id} `, requestMaker);
			}
			else
				this.logger.warn(`Failed to delete event ${id} : event does no exist`, requestMaker);
		} catch (error) {
			this.logger.error(`Failed to delete event ${id} on database(${error})`, requestMaker)
			throw new InternalServerErrorException(`Failed to delete event ${id} on database(${error})`)
		}
	}

	async removeAll(requestMaker: string): Promise<void> {
		try {
			await this.eventRepository.delete({});
			this.logger.warn(`Successfully deleted all events`, requestMaker);
		} catch (error) {
			this.logger.error(`Failed to delete all events on database(${error})`, requestMaker)
			throw new InternalServerErrorException(`Failed to delete all events on database(${error})`)
		}
	}

	async getStuds(id: number, requestMaker: string): Promise<Stud[]> {
		return this.eventRepository.query("SELECT * FROM stud s WHERE s.login IN (SELECT \"studLogin\" FROM inscriptions insc WHERE \"eventId\" = '" + id + "' );");
	}
}
