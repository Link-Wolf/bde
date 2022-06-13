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
			this.logger.log(`Remove all inscriptions`);
		} catch (error) {
			this.logger.error(`Error: ${error}`);
			throw new InternalServerErrorException(`Error: ${error}`);
		}
	}

	removeByStud(login: string) {
		try {
			if (this.studService.findOne(login)) {
				this.manager.query(`DELETE FROM "inscriptions" WHERE "studLogin" = '${login}'`);
				this.logger.log(`Remove all inscriptions of student ${login}`);
			}
			else {
				throw new NotFoundException(`No student ${login}`);
			}
		} catch (error) {
			this.logger.error(`Error: ${error}`);
			throw new InternalServerErrorException(`Error: ${error}`);
		}
	}

	removeByEvent(id: number) {
		try {
			this.manager.query(`DELETE FROM "inscriptions" WHERE "eventId" = ${id}`);
			this.logger.log(`Success`);
		} catch (error) {
			this.logger.error(`Error: ${error}`);
		}
	}

	async link(id: number, login: string) {
		try {
			if ((await this.manager.query(`SELECT * FROM "inscriptions" WHERE "studLogin" = '${login}' AND "eventId" = ${id}`)).length != 0)
				throw new ConflictException(`Inscription of ${login} at event ${id} already exists`)
			if (!await this.studService.findOne(login))
				throw new NotFoundException(`User ${login} not found`)
			if (!await this.eventService.findOne(id))
				throw new NotFoundException(`Event ${id} not found`)
			this.manager.query(`INSERT INTO "inscriptions" ("studLogin", "eventId") VALUES('${login}', ${id})`);
			this.logger.log(`Success`);
		} catch (error) {
			this.logger.error(`Error: ${error}`);
			throw new InternalServerErrorException(`Error: ${error}`);
		}
	}

	async findByStud(login: string) {
		try {
			let ret = await this.manager.query(`SELECT * FROM "inscriptions" WHERE "studLogin" = '${login}'`);
			if (ret.length == 0)
				this.logger.warn(`No inscription found for student ${login}`);
			else
				this.logger.log(`Success`);
			return ret
		} catch (error) {
			this.logger.error(`Error: ${error}`);
			throw new InternalServerErrorException(`Error: ${error}`);
		}
	}

	async findByEvent(id: number) {
		try {
			let ret = await this.manager.query(`SELECT * FROM "inscriptions" WHERE "eventId" = ${id}`);
			if (ret.length == 0)
				this.logger.warn(`No inscription with found for event ${id}`);
			else
				this.logger.log(`Success`);
			return ret
		} catch (error) {
			this.logger.error(`Error: ${error}`);
			throw new InternalServerErrorException(`Error: ${error}`);
		}
	}

	async findAll() {
		try {
			let ret = await this.manager.query(`SELECT * FROM "inscriptions"`);
			if (ret.length == 0)
				this.logger.warn(`No inscription found`);
			else
				this.logger.log(`Success`);
			return ret;
		} catch (error) {
			this.logger.error(`Error: ${error}`);
			throw new InternalServerErrorException(`Error: ${error}`);
		}
	}

	async remove(id: number, login: string) {
		try {
			let insc = await this.manager.query(`SELECT * FROM "inscriptions" WHERE "eventId" = ${id} AND "studLogin" = '${login}'`);
			if (insc.length) {
				this.manager.query(`DELETE FROM "inscriptions" WHERE "eventId" = ${id} AND "studLogin" = '${login}'`);
				this.logger.log(`Success`);
			}
			else
				this.logger.warn(`No inscription of student ${login} for event ${id} to delete`)
		} catch (error) {
			this.logger.error(`Error: ${error}`);
			throw new InternalServerErrorException(`Error: ${error}`);
		}
	}
}
