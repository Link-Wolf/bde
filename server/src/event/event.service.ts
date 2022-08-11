import {
	Injectable, InternalServerErrorException,
	NotFoundException, StreamableFile
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThanOrEqual, Repository } from 'typeorm';
import { Event } from '../entity/Event'
import { Stud } from '../entity/Stud';
import { LoggerService } from '../logger/logger.service';
import { StudService } from '../stud/stud.service';
import { EventDto, EventFilterDto } from './event.dto';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class EventService {
	findEventSubbed(login: string, rm: string): Promise<Event[]> {
		try {
			let ret = this.eventRepository.query(`SELECT * FROM event WHERE id IN (SELECT "eventId" FROM inscriptions WHERE "studLogin" = '${login}');`);
			this.logger.log(`Successfully got all events ${login} subbed to`, rm)
			return ret;
		}
		catch (error) {
			this.logger.error(`Failed to get all events ${login} subbed to on database(${error})`, login);
			throw new InternalServerErrorException(`Failed to get all events ${login} subbed to on database(${error})`)
		}
	}
	async getThumbnail(id: number, login: any) {
		try {
			const thumb_path = (await this.eventRepository.findOneById(id))
				.thumbnail_filename;
			if (!thumb_path)
				throw new NotFoundException
			const file = fs.createReadStream(join(process.cwd(), thumb_path));
			this.logger.log(`Successfully got the thumbnail of event ${id}`, login);
			return new StreamableFile(file);
		} catch (error) {
			this.logger.error(`Failed to get thumbnail of event ${id} on database(${error})`, login);
			throw new InternalServerErrorException(`Failed to to get thumbnail of event ${id} on database(${error})`)
		}
	}

	saveThumbnail(id: number, file: Express.Multer.File, login: any) {
		try {
			console.log(file)
			fs.writeFile(
				`assets / thumbnails / ${id}.${file.mimetype.split('/')[1]}`,
				file.buffer,
				(err) => {
					if (err) {
						this.logger.error(`Error while creating thumbnail(${err})`,
							login);
						throw err
					}
					else {
						this.eventRepository.update(id, {
							thumbnail_filename: `assets / thumbnails / ${id}.${file.mimetype.split('/')[1]} `
						})
						this.logger.log(`Successfully saved thumbnail of event ${id} `, login)
					}
				})
		} catch (error) {
			this.logger.error(`Failed to get all filtered events on database(${error})`, login);
			throw new InternalServerErrorException(`Could not find filtered events on database(${error})`)
		}
	}

	constructor(
		@InjectRepository(Event)
		private eventRepository: Repository<Event>,
		private studService: StudService,
		private logger: LoggerService,
	) { }

	async findAll(filterDto: EventFilterDto, requestMaker: string):
		Promise<Event[]> {
		try {
			let match = `SELECT * FROM "event" WHERE '1' = '1'`;
			if (filterDto.current)
				match += ` AND("end_date" IS NULL OR "end_date" > 'NOW()')`
			if (filterDto.free)
				match += ` AND "cost" = 0`
			if (filterDto.available)
				match += ` AND("nb_places" > (SELECT COUNT(*) FROM
				 "inscriptions" WHERE "eventId" = event.id) OR "nb_places" < 0)`
			if (filterDto.food)
				match += ` AND "consos" = 't'`
			if (filterDto.unlimited)
				match += ` AND "nb_places" = -42`
			if (filterDto.outside)
				match += ` AND "isOutside" = 't'`
			if (filterDto.sponsorised)
				match += ` AND "sponsorised" = 't'`
			match += ` ORDER BY ${filterDto.sort} ${
				filterDto.asc ? "ASC"
					: "DESC"
				} `
			match += `; `
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
				this.logger.log(`Got event with id ${id} `, requestMaker);
			return event;
		} catch (error) {
			this.logger.error(`Failed to find event
			${ id} on database(${error})`, requestMaker);
			throw new InternalServerErrorException(`Failed to find event ${id} on database(${error})`)
		}
	}

	async update(id: number, eventData: EventDto, requestMaker: string)
		: Promise<void> {
		// if no event id (find) -> err NotFoundException
		try {
			if (!await this.findOne(id, requestMaker)) {
				this.logger.error(`Failed to update event with id ${id} : event does not exist`, requestMaker);
				throw new NotFoundException(`Failed to update event with id ${id} : event does not exist`);
			}
			await this.eventRepository.update(id, eventData);
			this.logger.warn("Successfully updated event " + id, requestMaker);
		} catch (error) {
			this.logger.error(`Failed to update event ${id}
			on database(${ error})`, requestMaker)
			throw new InternalServerErrorException(`Failed to update event ${id} on database(${error})`)
		}
	}

	async subscribe(id: number, login: string, requestMaker: string)
		: Promise<void> {
		try {
			let event = await this.findOne(id, requestMaker);
			if (!event) {
				this.logger.error(`Failed to subscribe student ${login} to event ${id} : event does not exist`
					, requestMaker)
				throw new NotFoundException(`Failed to subscribe student ${login} to event ${id} : event does not exist`)
			}
			event.studs = await this.getStuds(id, requestMaker);
			let stud = await this.studService.findOne(login, requestMaker);
			if (!stud) {
				this.logger.error(`Failed to subscribe student ${login} to event ${id} : student does not exist`
					, requestMaker)
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

	async forceSubscribe(id: number, login: string, requestMaker: string)
		: Promise<void> {
		try {
			let event = await this.findOne(id, requestMaker);
			if (!event) {
				this.logger.error(`Failed to force subscribe student ${login} to event ${id} : event does not exist`
					, requestMaker)
				throw new NotFoundException(`Failed to force subscribe student ${login} to event ${id} : event does not exist`)
			}
			event.studs = await this.getStuds(id, requestMaker);
			let stud = await this.studService.findOne(login, requestMaker);
			if (!stud) {
				throw new NotFoundException(`Failed to force subscribe student ${login} to event ${id} : student does not exist`)
			}
			event.studs.push(stud);
			await this.eventRepository.save(event);
			this.logger.warn(`Successfully force subscribe student ${login} to event ${id} `, requestMaker);
		} catch (error) {
			this.logger.error(`Failed to force subscribe student ${login} to event ${id} on database(${error})`, requestMaker)
			throw new InternalServerErrorException(`Failed to force subscribe student ${login} to event ${id} on database(${error})`)
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
				this.logger.warn(`Successfully deleted event ${id} `,
					requestMaker);
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
		try {
			let a = this.eventRepository.query(`SELECT * FROM stud s WHERE s.login IN(SELECT \"studLogin" FROM inscriptions insc WHERE "eventId" = '${id}'); `);
			this.logger.log(`Successfully got all students subbed in event ${id} `, requestMaker)
			return a;
		}
		catch (error) {
			this.logger.error(`Failed to get all students subbed in event ${id} on database(${error})`, requestMaker)
			throw new InternalServerErrorException(`Failed to get all students subbed in event ${id} on database(${error})`)
		}
	}
}
