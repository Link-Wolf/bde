import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { EventService } from '../event/event.service';
import { LoggerService } from '../logger/logger.service';
import { StudService } from '../stud/stud.service';

@Injectable()
export class InscriptionService {
	async getIsSubbed(id: number, login: any) {
		try {
			const isSubbed = (await this.manager.query(`SELECT * FROM "inscriptions" WHERE "eventId"=${id} AND "studLogin"='${login}'`)).length > 0
			this.logger.log(`Successfully checked if ${login} is subbed to event ${id}`, login)
			return { isSubbed: isSubbed }
		} catch (error) {
			this.logger.error(`Failed to check if ${login} is subbed to event ${id} on database (${error})`, login);
			throw new InternalServerErrorException(`Failed check if ${login} is subbed to event ${id} on database (${error})`);
		}
	}
	constructor(
		private manager: EntityManager,
		private logger: LoggerService,
		private studService: StudService,
		private eventService: EventService,
	) { }

	removeAll(requestMaker: string) {
		try {
			this.manager.query(`DELETE FROM "inscriptions"`);
			this.logger.warn(`Successfully deleted all inscriptions`, requestMaker);
		} catch (error) {
			this.logger.error(`Failed to delete all inscriptions on database (${error})`, requestMaker);
			throw new InternalServerErrorException(`Failed to delete all inscriptions on database (${error})`);
		}
	}

	removeByStud(login: string, requestMaker: string) {
		try {
			if (this.studService.findOne(login, requestMaker)) {
				this.manager.query(`DELETE FROM "inscriptions" WHERE "studLogin" = '${login}'`);
				this.logger.warn(`Successfully deleted all inscriptions of student ${login}`, requestMaker);
			}
			else {
				this.logger.error(`Failed to remove all inscriptions of student ${login} : student does not exist`, requestMaker)
				throw new NotFoundException(`Failed to remove all inscriptions of student ${login} : student does not exist`);
			}
		} catch (error) {
			this.logger.error(`Failed to delete all inscriptions of student ${login} (${error})`, requestMaker);
			throw new InternalServerErrorException(`Failed to delete all inscriptions of student ${login} (${error})`);
		}
	}

	removeByEvent(id: number, requestMaker: string) {
		try {
			if (this.eventService.findOne(id, requestMaker)) {
				this.manager.query(`DELETE FROM "inscriptions" WHERE "eventId" = ${id}`);
				this.logger.warn(`Successfully deleted all inscriptions for event ${id}`, requestMaker);
			}
			else {
				this.logger.error(`Failed to delete all inscriptions for event ${id} : event does not exist`, requestMaker)
				throw new NotFoundException(`Failed to delete all inscriptions for event ${id} : event does not exist`);
			}
		} catch (error) {
			this.logger.error(`Failed to delete all inscriptions for event ${id} on database (${error})`, requestMaker);
		}
	}

	async link(id: number, login: string, requestMaker: string) {
		try {
			if ((await this.manager.query(`SELECT * FROM "inscriptions" WHERE "studLogin" = '${login}' AND "eventId" = ${id}`)).length != 0) {
				this.logger.error(`Failed to save inscription for student ${login} to event ${id} : inscription already exists`, requestMaker)
				throw new ConflictException(`Failed to save inscription for student ${login} to event ${id} : inscription already exists`)
			}
			if (!await this.studService.findOne(login, requestMaker)) {
				this.logger.error(`Failed to save inscription for student ${login} to event ${id} : student does not exist`, requestMaker)
				throw new NotFoundException(`Failed to save inscription for student ${login} to event ${id} : student does not exist`)
			}
			if (!await this.eventService.findOne(id, requestMaker)) {
				this.logger.error(`Failed to save inscription for student ${login} to event ${id} : event does not exist`, requestMaker)
				throw new NotFoundException(`Failed to save inscription for student ${login} to event ${id} : event does not exist`)
			}
			this.manager.query(`INSERT INTO "inscriptions" ("studLogin", "eventId") VALUES('${login}', ${id})`);
			this.logger.log(`Successfully save inscription for student ${login} to event ${id}`, requestMaker);
		} catch (error) {
			this.logger.error(`Failed to save inscription for student ${login} to event ${id} on database (${error})`, requestMaker);
			throw new InternalServerErrorException(`Failed to save inscription for student ${login} to event ${id} on database (${error})`);
		}
	}

	async findByStud(login: string, requestMaker: string) {
		try {
			let ret = await this.manager.query(`SELECT * FROM "inscriptions" WHERE "studLogin" = '${login}'`);
			if (ret.length == 0)
				this.logger.warn(`Fail to find all inscriptions for student ${login} : student does not have any inscription`, requestMaker);
			else
				this.logger.log(`Got all inscriptions for student ${login}`, requestMaker);
			return ret
		} catch (error) {
			this.logger.error(`Failed to get all inscriptions for student ${login} on database (${error})`, requestMaker);
			throw new InternalServerErrorException(`Failed to get all inscriptions for student ${login} on database (${error})`);
		}
	}

	async findByEvent(id: number, requestMaker: string) {
		try {
			let ret = await this.manager.query(`SELECT * FROM "inscriptions" WHERE "eventId" = ${id}`);
			if (ret.length == 0)
				this.logger.warn(`Failed to find all inscriptions for event ${id} : event does not have any inscription`, requestMaker);
			else
				this.logger.log(`Got all inscriptions for event ${id}`, requestMaker);
			return ret
		} catch (error) {
			this.logger.error(`Failed to get all inscriptions for event ${id} on database (${error})`, requestMaker);
			throw new InternalServerErrorException(`Failed to get all inscriptions for event ${id} on database (${error})`);
		}
	}

	async findAll(requestMaker: string) {
		try {
			let ret = await this.manager.query(`SELECT * FROM "inscriptions"`);
			// if (ret.length == 0)
			// 	this.logger.warn(`No inscription found`);
			// else
			this.logger.log(`Got all inscriptions`, requestMaker);
			return ret;
		} catch (error) {
			this.logger.error(`Failed to get all inscriptions on database (${error})`, requestMaker);
			throw new InternalServerErrorException(`Failed to get all inscriptions on database (${error})`);
		}
	}

	async remove(id: number, login: string, requestMaker: string) {
		try {
			let insc = await this.manager.query(`SELECT * FROM "inscriptions" WHERE "eventId" = ${id} AND "studLogin" = '${login}'`);
			if (insc.length) {
				this.manager.query(`DELETE FROM "inscriptions" WHERE "eventId" = ${id} AND "studLogin" = '${login}'`);
				this.logger.log(`Successfully delete inscription for student ${login} and event ${id}`, requestMaker);
			}
			else
				this.logger.warn(`Failed to delete inscription for student ${login} and event ${id} : inscription does not exist`, requestMaker)
		} catch (error) {
			this.logger.error(`Failed to delete inscription for student ${login} and event ${id} on database (${error})`, requestMaker);
			throw new InternalServerErrorException(`Failed to delete inscription for student ${login} and event ${id} on database (${error})`);
		}
	}

	async forceRemove(id: number, login: string, requestMaker: string) {
		try {
			let insc = await this.manager.query(`SELECT * FROM "inscriptions" WHERE "eventId" = ${id} AND "studLogin" = '${login}'`);
			if (insc.length) {
				this.manager.query(`DELETE FROM "inscriptions" WHERE "eventId" = ${id} AND "studLogin" = '${login}'`);
				this.logger.warn(`Successfully force delete inscription for student ${login} and event ${id}`, requestMaker);
			}
			else
				this.logger.warn(`Failed to force delete inscription for student ${login} and event ${id} : inscription does not exist`, requestMaker)
		} catch (error) {
			this.logger.error(`Failed to force delete inscription for student ${login} and event ${id} on database (${error})`, requestMaker);
			throw new InternalServerErrorException(`Failed to delete inscription for student ${login} and event ${id} on database (${error})`);
		}
	}

	async getStudByEvent(id: number, requestMaker: string) {
		try {
			let insc = await this.manager.query(`SELECT * FROM "stud" WHERE "login" IN (SELECT "studLogin" FROM "inscriptions" WHERE "eventId" = '${id}')`);
			if (insc.length)
				this.logger.log(`Successfully get all students who are subscribed to event ${id}`, requestMaker);
			return insc;
		} catch (error) {
			this.logger.error(`Failed to get all students who are subscribed to event ${id} on database (${error})`, requestMaker);
			throw new InternalServerErrorException(`Failed to get all students who are subscribed to event ${id} on database (${error})`);
		}
	}
}
