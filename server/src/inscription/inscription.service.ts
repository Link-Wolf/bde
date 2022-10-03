import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { EventService } from '../event/event.service';
import { LoggerService } from '../logger/logger.service';
import { StudService } from '../stud/stud.service';
import { ContributionService } from '../contribution/contribution.service';

@Injectable()
export class InscriptionService {
	constructor(
		private manager: EntityManager,
		private logger: LoggerService,
		private studService: StudService,
		private eventService: EventService,
		private contributionService: ContributionService
	) { }

	async getIsSubbed(id: number, login: any) {
		try {
			const isSubbed = (await this.manager.query(`SELECT * FROM "inscription" WHERE "eventId"=${id} AND "studLogin"='${login}'`)).length > 0
			this.logger.log(`Successfully checked if ${login} is subbed to event ${id}`, login)
			return { isSubbed: isSubbed }
		} catch (error) {
			this.logger.error(`Failed to check if ${login} is subbed to event ${id} on database (${error})`, login);
			throw new InternalServerErrorException(`Failed check if ${login} is subbed to event ${id} on database (${error})`);
		}
	}

	async removeAll(requestMaker: string) {
		try {
			let ret = await this.manager.query(`DELETE FROM "inscription"`);
			this.logger.warn(`Successfully deleted all inscription`, requestMaker, true);
			return ret
		} catch (error) {
			this.logger.error(`Failed to delete all inscription on database (${error})`, requestMaker, true);
			throw new InternalServerErrorException(`Failed to delete all inscription on database (${error})`);
		}
	}

	async removeByStud(login: string, requestMaker: string) {
		try {
			if (this.studService.findOne(login, requestMaker)) {
				let ret = await this.manager.query(`DELETE FROM "inscription" WHERE "studLogin" = '${login}'`);
				this.logger.warn(`Successfully deleted all inscription of student ${login}`, requestMaker, true);
				return ret
			}
			else {
				this.logger.error(`Failed to remove all inscription of student ${login} : student does not exist`, requestMaker, true)
				throw new NotFoundException(`Failed to remove all inscription of student ${login} : student does not exist`);
			}
		} catch (error) {
			this.logger.error(`Failed to delete all inscription of student ${login} (${error})`, requestMaker, true);
			throw new InternalServerErrorException(`Failed to delete all inscription of student ${login} (${error})`);
		}
	}

	async removeByEvent(id: number, requestMaker: string) {
		try {
			if (this.eventService.findOne(id, requestMaker)) {
				let ret = await this.manager.query(`DELETE FROM "inscription" WHERE "eventId" = ${id}`);
				this.logger.warn(`Successfully deleted all inscription for event ${id}`, requestMaker, true);
				return ret
			}
			else {
				this.logger.error(`Failed to delete all inscription for event ${id} : event does not exist`, requestMaker, true)
				throw new NotFoundException(`Failed to delete all inscription for event ${id} : event does not exist`);
			}
		} catch (error) {
			this.logger.error(`Failed to delete all inscription for event ${id} on database (${error})`, requestMaker, true);
		}
	}

	async link(id: number, login: string, requestMaker: string) {
		try {
			if ((await this.manager.query(`SELECT * FROM "inscription" WHERE "studLogin" = '${login}' AND "eventId" = ${id}`)).length != 0) {
				this.logger.error(`Failed to save inscription for student ${login} to event ${id} : inscription already exists`, requestMaker)
				throw new ConflictException(`Failed to save inscription for student ${login} to event ${id} : inscription already exists`)
			}
			const stud = await this.studService.findOne(login, requestMaker)
			if (!stud) {
				this.logger.error(`Failed to save inscription for student ${login} to event ${id} : student does not exist`, requestMaker)
				throw new NotFoundException(`Failed to save inscription for student ${login} to event ${id} : student does not exist`)
			}
			const event = await this.eventService.findOne(id, requestMaker);
			if (!event) {
				this.logger.error(`Failed to save inscription for student ${login} to event ${id} : event does not exist`, requestMaker)
				throw new NotFoundException(`Failed to save inscription for student ${login} to event ${id} : event does not exist`)
			}
			const subbed = (
				await this.manager.query
					(`SELECT * FROM "inscription" WHERE "eventId" = ${id}`))
				.length;
			const premium_subbed = (await this.manager.query(`SELECT * FROM "inscription" WHERE "eventId" = ${id} AND "studLogin" IN (SELECT "studLogin" FROM "contribution" WHERE "begin_date" < NOW() AND "end_date" > NOW())`)).length;
			if (event.nb_places !== -42 && (subbed >= event.nb_places || (await (async () => {
				let status = false
				let data =
					await this.contributionService.findForUser(stud.login, "42");
				data.forEach((item) => {
					if (
						new Date(item.end_date) > new Date(Date.now()) &&
						new Date(item.begin_date) <= new Date(Date.now())
					) {
						status = true
					}
				});
				return status
			})() && subbed - premium_subbed >= event.nb_places - event.nb_premium_places)))
				throw new ConflictException(`Failed to save inscription for student ${login} to event ${id} : event is full`)
			let ret = this.manager.query(`INSERT INTO "inscription" ("studLogin", "eventId") VALUES('${login}', ${id})`);
			this.logger.log(`Successfully save inscription for student ${login} to event ${id}`, requestMaker);
			return ret
		} catch (error) {
			this.logger.error(`Failed to save inscription for student ${login} to event ${id} on database (${error})`, requestMaker);
			throw new InternalServerErrorException(`Failed to save inscription for student ${login} to event ${id} on database (${error})`);
		}
	}

	async findByStud(login: string, requestMaker: string) {
		try {
			let ret = await this.manager.query(`SELECT * FROM "inscription" WHERE "studLogin" = '${login}'`);
			if (ret.length == 0)
				this.logger.warn(`Fail to find all inscription for student ${login} : student does not have any inscription`, requestMaker);
			else
				this.logger.log(`Got all inscription for student ${login}`, requestMaker);
			return ret
		} catch (error) {
			this.logger.error(`Failed to get all inscription for student ${login} on database (${error})`, requestMaker);
			throw new InternalServerErrorException(`Failed to get all inscription for student ${login} on database (${error})`);
		}
	}

	async findByEvent(id: number, requestMaker: string) {
		try {
			let ret = await this.manager.query(`SELECT * FROM "inscription" WHERE "eventId" = ${id}`);
			if (ret.length == 0)
				this.logger.warn(`Failed to find all inscription for event ${id} : event does not have any inscription`, requestMaker);
			else
				this.logger.log(`Got all inscription for event ${id}`, requestMaker);
			return ret
		} catch (error) {
			this.logger.error(`Failed to get all inscription for event ${id} on database (${error})`, requestMaker);
			throw new InternalServerErrorException(`Failed to get all inscription for event ${id} on database (${error})`);
		}
	}

	async findAll(requestMaker: string) {
		try {
			let ret = await this.manager.query(`SELECT * FROM "inscription"`);
			// if (ret.length == 0)
			// 	this.logger.warn(`No inscription found`);
			// else
			this.logger.log(`Got all inscription`, requestMaker);
			return ret;
		} catch (error) {
			this.logger.error(`Failed to get all inscription on database (${error})`, requestMaker);
			throw new InternalServerErrorException(`Failed to get all inscription on database (${error})`);
		}
	}

	async remove(id: number, login: string, requestMaker: string) {
		try {
			let insc = await this.manager.query(`SELECT * FROM "inscription" WHERE "eventId" = ${id} AND "studLogin" = '${login}'`);
			if (insc.length) {
				let ret = await this.manager.query(`DELETE FROM "inscription" WHERE "eventId" = ${id} AND "studLogin" = '${login}'`);
				this.logger.log(`Successfully delete inscription for student ${login} and event ${id}`, requestMaker);
				return ret
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
			let insc = await this.manager.query(`SELECT * FROM "inscription" WHERE "eventId" = ${id} AND "studLogin" = '${login}'`);
			if (!insc.lenght) {
				this.logger.warn(`Failed to force delete inscription for student ${login} and event ${id} : inscription does not exist`, requestMaker, true)
				throw new NotFoundException(`inscription does not exist`)
			}
			let ret = await this.manager.query(`DELETE FROM "inscription" WHERE "eventId" = ${id} AND "studLogin" = '${login}'`);
			this.logger.warn(`Successfully force delete inscription for student ${login} and event ${id}`, requestMaker, true);
			return ret
		} catch (error) {
			this.logger.error(`Failed to force delete inscription for student ${login} and event ${id} on database (${error})`, requestMaker, true);
			throw new InternalServerErrorException(`Failed to delete inscription for student ${login} and event ${id} on database (${error})`);
		}
	}

	async getStudByEvent(id: number, requestMaker: string) {
		try {
			let insc = await this.manager.query(`SELECT * FROM "stud" WHERE "login" IN (SELECT "studLogin" FROM "inscription" WHERE "eventId" = '${id}')`);
			if (insc.length)
				this.logger.log(`Successfully get all students who are subscribed to event ${id}`, requestMaker);
			return insc;
		} catch (error) {
			this.logger.error(`Failed to get all students who are subscribed to event ${id} on database (${error})`, requestMaker);
			throw new InternalServerErrorException(`Failed to get all students who are subscribed to event ${id} on database (${error})`);
		}
	}
}
