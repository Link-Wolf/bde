import {
	Injectable, NotFoundException, StreamableFile
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThanOrEqual, Repository, EntityManager } from 'typeorm';
import { Event } from '../entity/Event'
import { Stud } from '../entity/Stud';
import { LoggerService } from '../logger/logger.service';
import { StudService } from '../stud/stud.service';
import { EventDto, EventFilterDto } from './event.dto';
import * as fs from 'fs';
import { join } from 'path';
import * as JSZip from "jszip";

@Injectable()
export class EventService {
	constructor(
		@InjectRepository(Event)
		private eventRepository: Repository<Event>,
		private studService: StudService,
		private logger: LoggerService,
		private manager: EntityManager
	) { }

	findEventSubbed(login: string, rm: string): Promise<Event[]> {
		try {
			let ret = this.eventRepository.query(`SELECT * FROM event WHERE id IN (SELECT "eventId" FROM inscriptions WHERE "studLogin" = '${login}');`);
			this.logger.log(`Successfully got all events ${login} subbed to`, rm)
			return ret;
		}
		catch (error) {
			this.logger.error(`Failed to get all events ${login} subbed to on database(${error})`, login);
			throw error
		}
	}
	async getThumbnail(id: number, login: any) {
		try {
			const event = await this.eventRepository.findOneById(id);
			if (event === null)
				throw new NotFoundException()
			const thumb_path = event.thumbnail_filename;
			if (thumb_path === null)
				throw new NotFoundException()
			const file = fs.createReadStream(join(process.cwd(), thumb_path));
			this.logger.log(`Successfully got the thumbnail of event ${id}`, login);
			return new StreamableFile(file);
		} catch (error) {
			this.logger.error(`Failed to get thumbnail of event ${id} on database(${error})`, login);
			throw error
		}
	}

	async getAlbum(id: number, login: any) {
		try {
			const event = await this.eventRepository.findOneById(id);
			if (event === null || !fs.existsSync(`assets/album/events/${id}`))
				throw new NotFoundException()
			const addFilesFromDirectoryToZip =
				(directoryPath = `assets/album/events/${id}`, zip: JSZip) => {
					const directoryContents = fs.readdirSync(directoryPath, {
						withFileTypes: true,
					});

					directoryContents.forEach(({ name }) => {
						const path = `${directoryPath}/${name}`;

						if (fs.statSync(path).isFile()) {
							zip.file(`${name}`, fs.readFileSync(path));
						}

						if (fs.statSync(path).isDirectory()) {
							addFilesFromDirectoryToZip(path, zip);
						}
					});
				};

			const directoryPath = `assets/album/events/${id}`
			const zip = new JSZip();

			addFilesFromDirectoryToZip(directoryPath, zip);
			const zipAsBase64 = await zip.generateAsync({ type: "base64" });
			this.logger.log(`Successfully got the album of event ${id}`, login);

			return zipAsBase64;
		} catch (error) {
			this.logger.error(`Failed to get album of event ${id} on database(${error})`, login);
			throw error
		}
	}

	saveThumbnail(id: number, file: Express.Multer.File, login: any) {
		try {
			let path: any
			if ('err' in file) {
				let nb = Math.floor(Math.random() * 5)
				path = "assets/thumbnails/events/placeholder" + nb + ".jpg"
				this.eventRepository.update(id, {
					thumbnail_filename: path
				})
				this.logger.log(`Successfully saved thumbnail of event ${id}`, login)
			}
			else {
				path = `assets/thumbnails/events/${id}.${file.mimetype.split('/')[1]}`
				let ret = fs.writeFile(
					path,
					file.buffer,
					(err) => {
						if (err) {
							this.logger.error(`Error while creating event ${id} thumbnail(${err})`,
								login);
							throw err
						}
						else {
							this.eventRepository.update(id, {
								thumbnail_filename: path
							})
							this.logger.log(`Successfully saved thumbnail of event ${id}`, login)
						}
					})
				return (ret);
			}
		} catch (error) {
			this.logger.error(`Failed to save thumbnail of event ${id} on database(${error})`, login);
			throw error
		}
	}

	async findAll(filterDto: EventFilterDto, requestMaker: string):
		Promise<Event[]> {
		try {
			let match = `SELECT * FROM "event" WHERE '1' = '1'`;
			if (filterDto.album) {
				match += ` AND "album" = 't'`
			}
			else {
				if (filterDto.current)
					match += ` AND("end_date" IS NULL OR "end_date" > 'NOW()')`
				if (filterDto.free)
					match += ` AND "cost" = 0`
				if (filterDto.available)
					match += ` AND("nb_places" > (SELECT COUNT(*) FROM
				 "inscription" WHERE "eventId" = event.id) OR "nb_places" < 0)`
				if (filterDto.food)
					match += ` AND "consos" = 't'`
				if (filterDto.unlimited)
					match += ` AND "nb_places" = -42`
				if (filterDto.outside)
					match += ` AND "isOutside" = 't'`
				if (filterDto.sponsorised)
					match += ` AND "sponsorised" = 't'`
				if (filterDto.available_date)
					match += ` AND "available_date" < '${new Date(Date.now()).toLocaleString()}'`
			}
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
			throw error
		}
	}

	async findCurrent(requestMaker: string): Promise<Event[]> {
		try {
			let events = await this.eventRepository.findBy({
				end_date: MoreThanOrEqual(new Date(Date.now()))
			});
			events = events.concat(await this.eventRepository.findBy({
				end_date: IsNull()
			}));
			this.logger.log(`Got all current events`, requestMaker);
			return events;
		} catch (error) {
			this.logger.error(`Failed to get all current events on database(${error})`, requestMaker);
			throw error
		}
	}

	async findOne(id: number, requestMaker: string): Promise<any> {
		try {
			let event = await this.eventRepository.findOneBy({ id: id });
			if (!event)
				throw new NotFoundException(`Failed to find event ${id}`);
			this.logger.log(`Got event with id ${id} `, requestMaker);
			let ret = {
				...event,
				subbed: (
					await this.manager.query
						(`SELECT * FROM "inscription" WHERE "eventId" = ${id}`))
					.length,
				premium_subbed: (await this.manager.query(`SELECT * FROM "inscription" WHERE "eventId" = ${id} AND "studLogin" IN (SELECT "studLogin" FROM "contribution" WHERE "begin_date" < NOW() AND "end_date" > NOW())`)).length
			}
			return ret;
		} catch (error) {
			this.logger.error(`Failed to find event
			${ id} on database(${error})`, requestMaker);
			throw error
		}
	}

	async update(id: number, eventData: EventDto, requestMaker: string): Promise<any> {
		try {
			if (!await this.findOne(id, requestMaker)) {
				this.logger.error(`Failed to update event with id ${id} : event does not exist`, requestMaker);
				throw new NotFoundException(`Failed to update event with id ${id} : event does not exist`);
			}
			let ret = await this.eventRepository.update(id, eventData);
			this.logger.warn("Successfully updated event " + id, requestMaker);
			return ret;
		} catch (error) {
			this.logger.error(`Failed to update event ${id}
			on database(${ error})`, requestMaker)
			throw error
		}
	}

	async subscribe(id: number, login: string, cost: number, requestMaker: string): Promise<any> {
		try {
			let event = await this.findOne(id, requestMaker);
			if (!event) {
				this.logger.error(`Failed to subscribe student ${login} to event ${id} : event does not exist`
					, requestMaker)
				throw new NotFoundException(`Failed to subscribe student ${login} to event ${id} : event does not exist`)
			}
			let stud = await this.studService.findOne(login, requestMaker);
			if (!stud) {
				this.logger.error(`Failed to subscribe student ${login} to event ${id} : student does not exist`
					, requestMaker)
				throw new NotFoundException(`Failed to subscribe student ${login} to event ${id} : student does not exist`)
			}
			let ret = await this.eventRepository.query(`INSERT INTO inscription ("eventId", "studLogin",price,date) VALUES (${id}, '${login}', ${cost}, NOW())`);
			this.logger.log(`Successfully subscribe student ${login} to event ${id} `, requestMaker);
			return ret;
		} catch (error) {
			this.logger.error(`Failed to subscribe student ${login} to event ${id} on database(${error})`, requestMaker)
			throw error
		}
	}

	async forceSubscribe(id: number, login: string, cost: number, requestMaker: string): Promise<any> {
		try {
			let event = await this.findOne(id, requestMaker);
			if (!event) {
				this.logger.error(`Failed to force subscribe student ${login} to event ${id} : event does not exist`
					, requestMaker)
				throw new NotFoundException(`Failed to force subscribe student ${login} to event ${id} : event does not exist`)
			}
			let stud = await this.studService.findOne(login, requestMaker);
			if (!stud) {
				throw new NotFoundException(`Failed to force subscribe student ${login} to event ${id} : student does not exist`)
			}
			let ret = await this.eventRepository.query(`INSERT INTO inscription ("eventId", "studLogin",price,date) VALUES (${id}, '${login}', ${cost}, NOW())`);
			this.logger.warn(`Successfully force subscribe student ${login} to event ${id} `, requestMaker);
			return ret;
		} catch (error) {
			this.logger.error(`Failed to force subscribe student ${login} to event ${id} on database(${error})`, requestMaker)
			throw error
		}
	}

	async create(eventDto: EventDto, requestMaker: string): Promise<any> {
		try {
			let ret = await this.eventRepository.save(eventDto);
			this.logger.warn(`Successfully created new event ${eventDto.name} `, requestMaker);
			return (ret);
		} catch (error) {
			this.logger.error(`Failed to create event ${eventDto.name} on database(${error})`, requestMaker)
			throw error
		}
	}

	async removeOne(id: number, requestMaker: string): Promise<any> {
		try {
			if (await this.findOne(id, requestMaker)) {
				let ret = await this.eventRepository.delete({ id: id });
				this.logger.warn(`Successfully deleted event ${id} `,
					requestMaker);
				return ret
			}
			else
				this.logger.warn(`Failed to delete event ${id} : event does no exist`, requestMaker);
		} catch (error) {
			this.logger.error(`Failed to delete event ${id} on database(${error})`, requestMaker)
			throw error
		}
	}

	async removeAll(requestMaker: string): Promise<any> {
		try {
			let ret = await this.eventRepository.delete({});
			this.logger.warn(`Successfully deleted all events`, requestMaker);
			return ret
		} catch (error) {
			this.logger.error(`Failed to delete all events on database(${error})`, requestMaker)
			throw error
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
			throw error
		}
	}
}
