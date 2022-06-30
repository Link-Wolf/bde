import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { EventService } from '../event/event.service';
import { LoggerService } from '../logger/logger.service';
import { StudService } from '../stud/stud.service';

@Injectable()
export class InscriptionService {
	constructor(
		private manager: EntityManager,
		private logger: LoggerService,
		private studService: StudService,
		private eventService: EventService,
	) { }

	removeAll() {
		try {
			this.manager.query(`DELETE FROM "inscriptions"`);
			this.logger.warn(`Successfully deleted all inscriptions`);
		} catch (error) {
			this.logger.error(`Failed to delete all inscriptions on database (${error})`);
			throw new InternalServerErrorException(`Failed to delete all inscriptions on database (${error})`);
		}
	}

	removeByStud(login: string) {
		try {
			if (this.studService.findOne(login)) {
				this.manager.query(`DELETE FROM "inscriptions" WHERE "studLogin" = '${login}'`);
				this.logger.warn(`Successfully deleted all inscriptions of student ${login}`);
			}
			else {
				this.logger.error(`Failed to remove all inscriptions of student ${login} : student does not exist`)
				throw new NotFoundException(`Failed to remove all inscriptions of student ${login} : student does not exist`);
			}
		} catch (error) {
			this.logger.error(`Failed to delete all inscriptions of student ${login} (${error})`);
			throw new InternalServerErrorException(`Failed to delete all inscriptions of student ${login} (${error})`);
		}
	}

	removeByEvent(id: number) {
		try {
			if (this.eventService.findOne(id)) {
				this.manager.query(`DELETE FROM "inscriptions" WHERE "eventId" = ${id}`);
				this.logger.warn(`Successfully deleted all inscriptions for event ${id}`);
			}
			else {
				this.logger.error(`Failed to delete all inscriptions for event ${id} : event does not exist`)
				throw new NotFoundException(`Failed to delete all inscriptions for event ${id} : event does not exist`);
			}
		} catch (error) {
			this.logger.error(`Failed to delete all inscriptions for event ${id} on database (${error})`);
		}
	}

	async link(id: number, login: string) {
		try {
			if ((await this.manager.query(`SELECT * FROM "inscriptions" WHERE "studLogin" = '${login}' AND "eventId" = ${id}`)).length != 0) {
				this.logger.error(`Failed to save inscription for student ${login} to event ${id} : inscription already exists`)
				throw new ConflictException(`Failed to save inscription for student ${login} to event ${id} : inscription already exists`)
			}
			if (!await this.studService.findOne(login)) {
				this.logger.error(`Failed to save inscription for student ${login} to event ${id} : student does not exist`)
				throw new NotFoundException(`Failed to save inscription for student ${login} to event ${id} : student does not exist`)
			}
			if (!await this.eventService.findOne(id)) {
				this.logger.error(`Failed to save inscription for student ${login} to event ${id} : event does not exist`)
				throw new NotFoundException(`Failed to save inscription for student ${login} to event ${id} : event does not exist`)
			}
			this.manager.query(`INSERT INTO "inscriptions" ("studLogin", "eventId") VALUES('${login}', ${id})`);
			this.logger.log(`Successfully save inscription for student ${login} to event ${id}`);
		} catch (error) {
			this.logger.error(`Failed to save inscription for student ${login} to event ${id} on database (${error})`);
			throw new InternalServerErrorException(`Failed to save inscription for student ${login} to event ${id} on database (${error})`);
		}
	}

	async findByStud(login: string) {
		try {
			let ret = await this.manager.query(`SELECT * FROM "inscriptions" WHERE "studLogin" = '${login}'`);
			if (ret.length == 0)
				this.logger.warn(`Fail to find all inscriptions for student ${login} : student does not have any inscription`);
			else
				this.logger.log(`Got all inscriptions for student ${login}`);
			return ret
		} catch (error) {
			this.logger.error(`Failed to get all inscriptions for student ${login} on database (${error})`);
			throw new InternalServerErrorException(`Failed to get all inscriptions for student ${login} on database (${error})`);
		}
	}

	async findByEvent(id: number) {
		try {
			let ret = await this.manager.query(`SELECT * FROM "inscriptions" WHERE "eventId" = ${id}`);
			if (ret.length == 0)
				this.logger.warn(`Failed to find all inscriptions for event ${id} : event does not have any inscription`);
			else
				this.logger.log(`Got all inscriptions for event ${id}`);
			return ret
		} catch (error) {
			this.logger.error(`Failed to get all inscriptions for event ${id} on database (${error})`);
			throw new InternalServerErrorException(`Failed to get all inscriptions for event ${id} on database (${error})`);
		}
	}

	async findAll() {
		try {
			let ret = await this.manager.query(`SELECT * FROM "inscriptions"`);
			// if (ret.length == 0)
			// 	this.logger.warn(`No inscription found`);
			// else
			this.logger.log(`Got all inscriptions`);
			return ret;
		} catch (error) {
			this.logger.error(`Failed to get all inscriptions on database (${error})`);
			throw new InternalServerErrorException(`Failed to get all inscriptions on database (${error})`);
		}
	}

	async remove(id: number, login: string) {
		try {
			let insc = await this.manager.query(`SELECT * FROM "inscriptions" WHERE "eventId" = ${id} AND "studLogin" = '${login}'`);
			if (insc.length) {
				this.manager.query(`DELETE FROM "inscriptions" WHERE "eventId" = ${id} AND "studLogin" = '${login}'`);
				this.logger.log(`Successfully delete inscription for student ${login} and event ${id}`);
			}
			else
				this.logger.warn(`Failed to delete inscription for student ${login} and event ${id} : inscription does not exist`)
		} catch (error) {
			this.logger.error(`Failed to delete inscription for student ${login} and event ${id} on database (${error})`);
			throw new InternalServerErrorException(`Failed to delete inscription for student ${login} and event ${id} on database (${error})`);
		}
	}

	async forceRemove(id: number, login: string) {
		try {
			let insc = await this.manager.query(`SELECT * FROM "inscriptions" WHERE "eventId" = ${id} AND "studLogin" = '${login}'`);
			if (insc.length) {
				this.manager.query(`DELETE FROM "inscriptions" WHERE "eventId" = ${id} AND "studLogin" = '${login}'`);
				this.logger.warn(`Successfully force delete inscription for student ${login} and event ${id}`);
			}
			else
				this.logger.warn(`Failed to force delete inscription for student ${login} and event ${id} : inscription does not exist`)
		} catch (error) {
			this.logger.error(`Failed to force delete inscription for student ${login} and event ${id} on database (${error})`);
			throw new InternalServerErrorException(`Failed to delete inscription for student ${login} and event ${id} on database (${error})`);
		}
	}

	async getStudByEvent(id: number) {
		try {
			let insc = await this.manager.query(`SELECT * FROM "stud" WHERE "login" IN (SELECT "studLogin" FROM "inscriptions" WHERE "eventId" = '${id}')`);
			if (insc.length)
				this.logger.log(`Successfully get all students who are subscribed to event ${id}`);
			return insc;
		} catch (error) {
			this.logger.error(`Failed to get all students who are subscribed to event ${id} on database (${error})`);
			throw new InternalServerErrorException(`Failed to get all students who are subscribed to event ${id} on database (${error})`);
		}
	}
}
