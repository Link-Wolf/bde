import {
	BadRequestException,
	Injectable,
	NotFoundException,
	StreamableFile,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, MoreThanOrEqual, Repository, EntityManager } from "typeorm";
import { Event } from "../entity/Event";
import { Stud } from "../entity/Stud";
import { LoggerService } from "../logger/logger.service";
import { StudService } from "../stud/stud.service";
import { EventDto, EventFilterDto } from "./event.dto";
import * as fs from "fs";
import { join } from "path";

@Injectable()
export class EventService {
	constructor(
		@InjectRepository(Event)
		private eventRepository: Repository<Event>,
		private studService: StudService,
		private logger: LoggerService,
		private manager: EntityManager
	) {}

	async findEventSubbed(login: string, rm: string): Promise<Event[]> {
		try {
			let ret = this.eventRepository.query(
				`SELECT * FROM event WHERE id IN (SELECT "eventId" FROM inscription WHERE "studLogin" = '${login}');`
			);
			this.logger.log(`Got all events ${login} subbed to`, rm);
			return ret;
		} catch (error) {
			this.logger.error(
				`Failed -> Get all events ${login} subbed to on database (${error})`,
				rm
			);
			throw error;
		}
	}
	async getThumbnail(id: number, login: any) {
		try {
			const event = await this.eventRepository.findOneById(id);
			if (!event) {
				this.logger.error(
					`Failed -> Get thumbnail of event ${id} : event doesn't exist`,
					login
				);
				throw new NotFoundException(
					`Failed to get thumbnail of event ${id} : event doesn't exist`
				);
			}
			const thumb_path = event.thumbnail_filename;
			if (!thumb_path) {
				this.logger.error(
					`Failed -> Get thumbnail of event ${id} : event doesn't has any thumbnail`,
					login
				);
				throw new NotFoundException(
					`Failed to get thumbnail of event ${id} : event doesn't has any thumbnail`
				);
			}
			const file = fs.createReadStream(join(process.cwd(), thumb_path));
			this.logger.log(`Got thumbnail of event ${id}`, login);
			return new StreamableFile(file);
		} catch (error) {
			this.logger.error(
				`Failed -> Get thumbnail of event ${id} on database (${error})`,
				login
			);
			throw error;
		}
	}

	async saveThumbnail(id: number, file: Express.Multer.File, login: any) {
		try {
			let path: any;
			if (file === undefined) {
				let nb = Math.floor(Math.random() * 5);
				path =
					"assets/placeholders/thumbnails/placeholder" + nb + ".jpg";
				this.eventRepository.update(id, {
					thumbnail_filename: path,
				});
				this.logger.log(`Saved thumbnail of event ${id}`, login, true);
			} else {
				path = `assets/thumbnails/events/${id}.${
					file.mimetype.split("/")[1]
				}`;
				let ret = fs.writeFile(path, file.buffer, (err) => {
					if (err) {
						this.logger.error(
							`Failed -> Create event ${id} thumbnail (${err})`,
							login,
							true
						);
						throw err;
					} else {
						this.eventRepository.update(id, {
							thumbnail_filename: path,
						});
						this.logger.log(
							`Saved thumbnail of event ${id}`,
							login,
							true
						);
					}
				});
				return ret;
			}
		} catch (error) {
			this.logger.error(
				`Failed -> Save thumbnail of event ${id} on database (${error})`,
				login,
				true
			);
			throw error;
		}
	}

	async findAll(
		filterDto: EventFilterDto,
		requestMaker: string
	): Promise<Event[]> {
		try {
			let match = `SELECT * FROM "event" WHERE '1' = '1'`;
			if (filterDto.album) {
				match += ` AND "album" = 't'`;
			} else {
				if (filterDto.current)
					match += ` AND("end_date" IS NULL OR "end_date" > 'NOW()')`;
				if (filterDto.free) match += ` AND "cost" = 0`;
				if (filterDto.available)
					match += ` AND("nb_places" > (SELECT COUNT(*) FROM
				 "inscription" WHERE "eventId" = event.id) OR "nb_places" < 0)`;
				if (filterDto.food) match += ` AND "consos" = 't'`;
				if (filterDto.unlimited) match += ` AND "nb_places" = -42`;
				if (filterDto.outside) match += ` AND "isOutside" = 't'`;
				if (filterDto.sponso) match += ` AND "sponso" = 't'`;
				if (filterDto.available_date)
					match += ` AND "available_date" < '${new Date(
						Date.now()
					).toISOString()}'`;
			}
			match += ` ORDER BY ${filterDto.sort} ${
				filterDto.asc ? "ASC" : "DESC"
			} `;
			match += `; `;
			let events = await this.eventRepository.query(match);
			// if (events.length == 0)			// 	this.logger.warn(`No events found`)
			// else
			this.logger.log(`Got all filtered events`, requestMaker);
			return events;
		} catch (error) {
			this.logger.error(
				`Failed -> Get all filtered events on database (${error})`,
				requestMaker
			);
			throw error;
		}
	}

	async findAllAdmin(requestMaker: string): Promise<Event[]> {
		try {
			let events = await this.eventRepository.find({
				order: { begin_date: "DESC" },
			});
			this.logger.log(`Got all events`, requestMaker);
			return events;
		} catch (error) {
			this.logger.error(
				`Failed -> Get all events on database (${error})`,
				requestMaker
			);
			throw error;
		}
	}

	async findCurrent(requestMaker: string): Promise<Event[]> {
		try {
			let events = await this.eventRepository.findBy({
				end_date: MoreThanOrEqual(new Date(Date.now())),
			});
			events = events.concat(
				await this.eventRepository.findBy({
					end_date: IsNull(),
				})
			);
			this.logger.log(`Got all current events`, requestMaker);
			return events;
		} catch (error) {
			this.logger.error(
				`Failed -> Get all current events on database (${error})`,
				requestMaker
			);
			throw error;
		}
	}

	async findOne(id: number, requestMaker: string): Promise<any> {
		try {
			let event = await this.eventRepository.findOneBy({ id: id });
			if (!event) {
				this.logger.error(
					`Failed -> Get event ${id} : event ${id} doesn't exist`,
					requestMaker
				);
				throw new NotFoundException(
					`Failed to get event ${id} : event ${id} doesn't exist`
				);
			}
			this.logger.log(`Got event with id ${id} `, requestMaker);
			let ret = {
				...event,
				subbed: (
					await this.manager.query(
						`SELECT * FROM "inscription" WHERE "eventId" = ${id}`
					)
				).length,
				premium_subbed: Math.max(
					event.nb_premium_places,
					(
						await this.manager.query(
							`SELECT * FROM "inscription" WHERE "eventId" = ${id} AND "studLogin" IN (SELECT "studLogin" FROM "contribution" WHERE "begin_date" < NOW() AND "end_date" > NOW())`
						)
					).length
				),
			};
			return ret;
		} catch (error) {
			this.logger.error(
				`Failed -> Find event ${id} on database (${error})`,
				requestMaker
			);
			throw error;
		}
	}

	async update(
		id: number,
		eventData: EventDto,
		requestMaker: string
	): Promise<any> {
		try {
			if (!(await this.findOne(id, requestMaker))) {
				this.logger.error(
					`Failed -> Update event with id ${id} : event ${id} does not exist`,
					requestMaker,
					true
				);
				throw new NotFoundException(
					`Failed to update event with id ${id} : event ${id} does not exist`
				);
			}
			let ret = await this.eventRepository.update(id, eventData);
			this.logger.warn(`Updated event ${id}`, requestMaker, true);
			return ret;
		} catch (error) {
			this.logger.error(
				`Failed -> Update event ${id} on database (${error})`,
				requestMaker,
				true
			);
			throw error;
		}
	}

	async subscribe(
		id: number,
		login: string,
		cost: number,
		requestMaker: string
	): Promise<any> {
		try {
			let event = await this.findOne(id, requestMaker);
			if (!event) {
				this.logger.error(
					`Failed -> Subscribe student ${login} to event ${id} : event ${id} does not exist`,
					requestMaker
				);
				throw new NotFoundException(
					`Failed to subscribe student ${login} to event ${id} : event does not exist`
				);
			}
			let stud = await this.studService.findOne(login, requestMaker);
			if (!stud) {
				this.logger.error(
					`Failed -> Subscribe student ${login} to event ${id} : student ${login} does not exist`,
					requestMaker
				);
				throw new NotFoundException(
					`Failed to subscribe student ${login} to event ${id} : student ${login} does not exist`
				);
			}
			let subs = await this.findEventSubbed(login, requestMaker);
			for (let i = 0; i < subs.length; i++) {
				if (subs[i].id == id) {
					this.logger.error(
						`Failed -> Subscribe student ${login} to event ${id} : student ${login} is already subscribed to event ${id}`,
						requestMaker
					);
					throw new BadRequestException(
						`Failed to subscribe student ${login} to event ${id} : student ${login} is already subscribed to event ${id}`
					);
				}
			}
			let ret = await this.eventRepository.query(
				`INSERT INTO inscription("eventId", "studLogin", price, date) VALUES(${id}, '${login}', ${cost}, NOW())`
			);
			this.logger.log(
				`Subscribed student ${login} to event ${id} `,
				requestMaker
			);
			return ret;
		} catch (error) {
			this.logger.error(
				`Failed -> Subscribe student ${login} to event ${id} on database (${error})`,
				requestMaker
			);
			throw error;
		}
	}

	async forceSubscribe(
		id: number,
		login: string,
		cost: number,
		requestMaker: string
	): Promise<any> {
		try {
			let event = await this.findOne(id, requestMaker);
			if (!event) {
				this.logger.error(
					`Failed -> Force subscribe student ${login} to event ${id} : event ${id} does not exist`,
					requestMaker
				);
				throw new NotFoundException(
					`Failed to force subscribe student ${login} to event ${id} : event ${id} does not exist`
				);
			}
			let stud = await this.studService.findOne(login, requestMaker);
			if (!stud) {
				this.logger.error(
					`Failed -> Force subscribe student ${login} to event ${id} : student ${login} does not exist`,
					requestMaker
				);
				throw new NotFoundException(
					`Failed to force subscribe student ${login} to event ${id} : student ${login} does not exist`
				);
			}
			let ret = await this.eventRepository.query(
				`INSERT INTO inscription("eventId", "studLogin", price, date) VALUES(${id}, '${login}', ${cost}, NOW())`
			);
			this.logger.warn(
				`Force subscribed student ${login} to event ${id} `,
				requestMaker,
				true
			);
			return ret;
		} catch (error) {
			this.logger.error(
				`Failed -> Force subscribe student ${login} to event ${id} on database (${error})`,
				requestMaker,
				true
			);
			throw error;
		}
	}

	async create(eventDto: EventDto, requestMaker: string): Promise<any> {
		try {
			let ret = await this.eventRepository.save(eventDto);
			this.logger.warn(
				`Created new event ${eventDto.name}`,
				requestMaker,
				true
			);
			return ret;
		} catch (error) {
			this.logger.error(
				`Failed -> Create event ${eventDto.name} on database (${error})`,
				requestMaker,
				true
			);
			throw error;
		}
	}

	async removeOne(id: number, requestMaker: string): Promise<any> {
		try {
			if (await this.findOne(id, requestMaker)) {
				let ret = await this.eventRepository.delete({ id: id });
				this.logger.warn(`Deleted event ${id}`, requestMaker, true);
				return ret;
			} else {
				this.logger.warn(
					`Failed -> Delete event ${id} : event doesn't exist`,
					requestMaker,
					true
				);
				throw new NotFoundException(
					`Failed to delete event ${id} : event doesn't exist`
				);
			}
		} catch (error) {
			this.logger.error(
				`Failed -> Delete event ${id} on database (${error})`,
				requestMaker,
				true
			);
			throw error;
		}
	}

	async removeAll(requestMaker: string): Promise<any> {
		try {
			let ret = await this.eventRepository.delete({});
			this.logger.warn(`Deleted all events`, requestMaker, true);
			return ret;
		} catch (error) {
			this.logger.error(
				`Failed -> Delete all events on database (${error})`,
				requestMaker,
				true
			);
			throw error;
		}
	}

	async getStuds(id: number, requestMaker: string): Promise<Stud[]> {
		try {
			let a = this.eventRepository.query(
				`SELECT * FROM stud s WHERE s.login IN(SELECT \"studLogin" FROM inscription insc WHERE "eventId" = '${id}'); `
			);
			this.logger.log(
				`Got all students subbed in event ${id} `,
				requestMaker
			);
			return a;
		} catch (error) {
			this.logger.error(
				`Failed -> Get all students subbed in event ${id} on database (${error})`,
				requestMaker
			);
			throw error;
		}
	}
}
