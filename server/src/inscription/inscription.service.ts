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
			this.logger.log(`Checked if student ${login} is subbed to event ${id}`, login)
			return { isSubbed: isSubbed }
		} catch (error) {
			this.logger.error(`Failed -> Check if student ${login} is subbed to event ${id} on database (${error})`, login);
			throw error
		}
	}

	async removeAll(requestMaker: string) {
		try {
			let ret = await this.manager.query(`DELETE FROM "inscription"`);
			this.logger.warn(`Deleted all subscriptions`, requestMaker, true);
			return ret
		} catch (error) {
			this.logger.error(`Failed -> Delete all subscriptions on database (${error})`, requestMaker, true);
			throw error
		}
	}

	async removeByStud(login: string, requestMaker: string) {
		try {
			if (this.studService.findOne(login, requestMaker)) {
				let ret = await this.manager.query(`DELETE FROM "inscription" WHERE "studLogin" = '${login}'`);
				this.logger.warn(`Deleted all subscriptions of student ${login}`, requestMaker, true);
				return ret
			}
			else {
				this.logger.error(`Failed -> Remove all subscriptions of student ${login} : student does not exist`, requestMaker, true)
				throw new NotFoundException(`Failed to remove all subscriptions of student ${login} : student does not exist`);
			}
		} catch (error) {
			this.logger.error(`Failed -> Delete all subscriptions of student ${login} (${error})`, requestMaker, true);
			throw error
		}
	}

	async removeByEvent(id: number, requestMaker: string) {
		try {
			if (this.eventService.findOne(id, requestMaker)) {
				let ret = await this.manager.query(`DELETE FROM "inscription" WHERE "eventId" = ${id}`);
				this.logger.warn(`Deleted all subscriptions for event ${id}`, requestMaker, true);
				return ret
			}
			else {
				this.logger.error(`Failed -> Delete all subscriptions for event ${id} : event does not exist`, requestMaker, true)
				throw new NotFoundException(`Failed to delete all subscriptions for event ${id} : event does not exist`);
			}
		} catch (error) {
			this.logger.error(`Failed -> Delete all subscriptions for event ${id} on database (${error})`, requestMaker, true);
			throw error
		}
	}

	async link(id: number, login: string, requestMaker: string) {
		try {
			if ((await this.manager.query(`SELECT * FROM "inscription" WHERE "studLogin" = '${login}' AND "eventId" = ${id}`)).length != 0) {
				this.logger.error(`Failed -> Save subscription for student ${login} to event ${id} : subscription already exists`, requestMaker)
				throw new ConflictException(`Failed to save subscription for student ${login} to event ${id} : subscription already exists`)
			}
			const stud = await this.studService.findOne(login, requestMaker)
			if (!stud) {
				this.logger.error(`Failed -> Save subscription for student ${login} to event ${id} : student does not exist`, requestMaker)
				throw new NotFoundException(`Failed to save subscription for student ${login} to event ${id} : student does not exist`)
			}
			const event = await this.eventService.findOne(id, requestMaker);
			if (!event) {
				this.logger.error(`Failed -> Save subscription for student ${login} to event ${id} : event does not exist`, requestMaker)
				throw new NotFoundException(`Failed to save subscription for student ${login} to event ${id} : event does not exist`)
			}
			const subbed = (
				await this.manager.query
					(`SELECT * FROM "inscription" WHERE "eventId" = ${id}`))
				.length;
			const premium_subbed = (await this.manager.query(`SELECT * FROM "inscription" WHERE "eventId" = ${id} AND "studLogin" IN (SELECT "studLogin" FROM "contribution" WHERE "begin_date" < NOW() AND "end_date" > NOW())`)).length;
			if (event.nb_places !== -42 && (subbed >= event.nb_places || (await (async () => {
				let status = false
				let data =
					await this.contributionService.findForUser(stud.login, requestMaker);
				data.forEach((item) => {
					if (
						new Date(item.end_date) > new Date(Date.now()) &&
						new Date(item.begin_date) <= new Date(Date.now())
					) {
						status = true
					}
				});
				return status
			})() && subbed - premium_subbed >= event.nb_places - event.nb_premium_places))) {
				this.logger.error(`Failed to save subscription for student ${login} to event ${id} : event ${id} is full`, requestMaker)
				throw new ConflictException(`Failed to save subscription for student ${login} to event ${id} : event ${id} is full`)
			}
			let ret = await this.manager.query(`INSERT INTO "inscription" ("studLogin", "eventId", "date") VALUES('${login}', ${id}, NOW())`);
			this.logger.log(`Saved subscription for student ${login} to event ${id}`, requestMaker);
			return ret
		} catch (error) {
			this.logger.error(`Failed -> Save subscription for student ${login} to event ${id} on database (${error})`, requestMaker);
			throw error
		}
	}

	async findByStud(login: string, requestMaker: string) {
		try {
			let ret = await this.manager.query(`SELECT * FROM "inscription" WHERE "studLogin" = '${login}' ORDER BY "date" DESC`);
			this.logger.log(`Got all subscriptions for student ${login}`, requestMaker);
			return ret
		} catch (error) {
			this.logger.error(`Failed -> Get all subscriptions for student ${login} on database (${error})`, requestMaker);
			throw error
		}
	}

	async findByEvent(id: number, requestMaker: string) {
		try {
			let ret = await this.manager.query(`SELECT * FROM "inscription" WHERE "eventId" = ${id}`);
			this.logger.log(`Got all subscriptions for event ${id}`, requestMaker);
			return ret
		} catch (error) {
			this.logger.error(`Failed -> Get all subscriptions for event ${id} on database (${error})`, requestMaker);
			throw error
		}
	}

	async findAll(requestMaker: string) {
		try {
			let ret = await this.manager.query(`SELECT * FROM "inscription"`);
			this.logger.log(`Got all subscriptions`, requestMaker);
			return ret;
		} catch (error) {
			this.logger.error(`Failed -> Get all subscriptions on database (${error})`, requestMaker);
			throw error
		}
	}

	async remove(id: number, login: string, requestMaker: string) {
		try {
			let insc = await this.manager.query(`SELECT * FROM "inscription" WHERE "eventId" = ${id} AND "studLogin" = '${login}'`);
			if (insc.length) {
				let ret = await this.manager.query(`DELETE FROM "inscription" WHERE "eventId" = ${id} AND "studLogin" = '${login}'`);
				this.logger.log(`Deleted subscription for student ${login} and event ${id}`, requestMaker);
				return ret
			}
			else {
				this.logger.warn(`Failed -> Delete subscription for student ${login} and event ${id} : subscription does not exist`, requestMaker)
				throw new NotFoundException(`Failed to delete subscription for student ${login} and event ${id} : subscription does not exist`)
			}
		} catch (error) {
			this.logger.error(`Failed to delete subscription for student ${login} and event ${id} on database (${error})`, requestMaker);
			throw error
		}
	}

	async forceRemove(id: number, login: string, requestMaker: string) {
		try {
			let insc = await this.manager.query(`SELECT * FROM "inscription" WHERE "eventId" = ${id} AND "studLogin" = '${login}'`);
			if (!insc.lenght) {
				this.logger.warn(`Failed -> Force delete subscription for student ${login} and event ${id} : subscription does not exist`, requestMaker, true)
				throw new NotFoundException(`Failed to force delete subscription for student ${login} and event ${id} : subscription does not exist`)
			}
			let ret = await this.manager.query(`DELETE FROM "inscription" WHERE "eventId" = ${id} AND "studLogin" = '${login}'`);
			this.logger.warn(`Force deleted subscription for student ${login} and event ${id}`, requestMaker, true);
			return ret
		} catch (error) {
			this.logger.error(`Failed -> Force delete subscription for student ${login} and event ${id} on database (${error})`, requestMaker, true);
			throw error
		}
	}

	async getStudByEvent(id: number, requestMaker: string) {
		try {
			let insc = await this.manager.query(`SELECT * FROM "stud" WHERE "login" IN (SELECT "studLogin" FROM "inscription" WHERE "eventId" = '${id}')`);
			if (insc.length)
				this.logger.log(`Got all students subscribed to event ${id}`, requestMaker);
			return insc;
		} catch (error) {
			this.logger.error(`Failed -> Get all students subscribed to event ${id} on database (${error})`, requestMaker);
			throw error
		}
	}
}
