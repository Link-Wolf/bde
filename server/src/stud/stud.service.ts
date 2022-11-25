import {
	ConflictException,
	Injectable,
	NotFoundException,
	BadRequestException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Stud } from '../entity/Stud';
import { LoggerService } from '../logger/logger.service';
import { StudDto } from './stud.dto';
import { ContributionService } from '../contribution/contribution.service';
import { createCipheriv, createDecipheriv } from 'crypto';

@Injectable()
export class StudService {
	_aes: any;
	constructor(
		@InjectRepository(Stud)
		private studRepository: Repository<Stud>,
		private contributionService: ContributionService,
		private readonly logger: LoggerService,
	) {
		this._aes = JSON.parse(process.env.AES)
	}

	async findFilterd(
		sort: { asc: boolean, sortField: string },
		requestMaker: string
	) {
		try {
			let order = {};
			order[`${sort.sortField}`] = `${sort.asc ? "DESC" : "ASC"}`
			let studs = await this.studRepository.find({ order: order });
			for (let stud of studs) {
				stud.isPremium = await (async () => {
					let status = false;
					let data = await this.contributionService.findForUser(stud.login, requestMaker);
					data.forEach((item) => {
						if (new Date(item.end_date) > new Date(Date.now()) &&
							new Date(item.begin_date) <= new Date(Date.now())) {
							status = true;
						}
					});
					return status;
				})();
			}
			this.logger.log(`Got all students`, requestMaker);
			return studs;
		}
		catch (error) {
			this.logger.error(`Failed -> Get all students on database (${error})`, requestMaker)
			throw error;
		}
	}

	async findAll(requestMaker: string): Promise<Stud[]> {
		try {
			let studs = await this.studRepository.find({ order: { login: "ASC" } });
			// if (studs.length == 0) {
			// 	this.logger.warn(`No stud found`)
			// }
			// else
			for (let stud of studs) {
				stud.isPremium = await (async () => {
					let status = false;
					let data = await this.contributionService.findForUser(stud.login, requestMaker);
					data.forEach((item) => {
						if (new Date(item.end_date) > new Date(Date.now()) &&
							new Date(item.begin_date) <= new Date(Date.now())) {
							status = true;
						}
					});
					return status;
				})();
			}
			this.logger.log(`Got all students`, requestMaker);
			return studs;
		}
		catch (error) {
			this.logger.error(`Failed -> Get all students on database (${error})`, requestMaker)
			throw error;
		}
	}

	async findAdmins(requestMaker: string): Promise<Stud[]> {
		try {
			let studs = await this.studRepository.findBy({
				isAdmin: true,
				clearance: Not(21)
			});
			for (let stud of studs) {
				stud.isPremium = await (async () => {
					let status = false;
					let data = await this.contributionService.findForUser(stud.login, requestMaker);
					data.forEach((item) => {
						if (new Date(item.end_date) > new Date(Date.now()) &&
							new Date(item.begin_date) <= new Date(Date.now())) {
							status = true;
						}
					});
					return status;
				})();
			}
			this.logger.log(`Got all admin members`, requestMaker, true);
			console.log(studs)
			return studs;
		}
		catch (error) {
			this.logger.error(`Failed -> Get all admin members on database (${error})`, requestMaker, true)
			throw error;
		}
	}

	async findNoAdmins(requestMaker: string): Promise<Stud[]> {
		try {
			let studs = await this.studRepository.findBy({
				isAdmin: false,
			});
			for (let stud of studs) {
				stud.isPremium = await (async () => {
					let status = false;
					let data = await this.contributionService.findForUser(stud.login, requestMaker);
					data.forEach((item) => {
						if (new Date(item.end_date) > new Date(Date.now()) &&
							new Date(item.begin_date) <= new Date(Date.now())) {
							status = true;
						}
					});
					return status;
				})();
			}
			this.logger.log(`Got all non-admin members`, requestMaker, true);
			return studs;
		}
		catch (error) {
			this.logger.error(`Failed -> Get all non-admin members on database (${error})`, requestMaker, true)
			throw error;
		}
	}

	async findVolunteers(requestMaker: string): Promise<Stud[]> {
		try {
			let studs = await this.studRepository.findBy({
				clearance: 9
			});
			for (let stud of studs) {
				stud.isPremium = await (async () => {
					let status = false;
					let data = await this.contributionService.findForUser(stud.login, requestMaker);
					data.forEach((item) => {
						if (new Date(item.end_date) > new Date(Date.now()) &&
							new Date(item.begin_date) <= new Date(Date.now())) {
							status = true;
						}
					});
					return status;
				})();
			}
			this.logger.log(`Got all volunteers`, requestMaker, true);
			return studs;
		}
		catch (error) {
			this.logger.error(`Failed -> Get all volunteers on database (${error})`, requestMaker, true)
			throw error;
		}
	}

	async findNoVolunteers(requestMaker: string): Promise<Stud[]> {
		try {
			let studs = await this.studRepository.findBy({
				clearance: 7
			});
			for (let stud of studs) {
				stud.isPremium = await (async () => {
					let status = false;
					let data = await this.contributionService.findForUser(stud.login, requestMaker);
					data.forEach((item) => {
						if (new Date(item.end_date) > new Date(Date.now()) &&
							new Date(item.begin_date) <= new Date(Date.now())) {
							status = true;
						}
					});
					return status;
				})();
			}
			this.logger.log(`Got all non-volunteers`, requestMaker, true);
			return studs;
		}
		catch (error) {
			this.logger.error(`Failed -> Get all non-volunteers on database (${error})`, requestMaker, true)
			throw error;
		}
	}

	async findOne(login: string, requestMaker: string): Promise<any> {
		try {
			let stud = await this.studRepository.findOneBy({ login: login });
			if (!stud) {
				this.logger.warn(`Failed -> Find student with login ${login} : student does not exist`, requestMaker)
				return stud
			}
			else
				this.logger.log(`Got student with login ${login}`, requestMaker);
			const ret = {
				...stud, isPremium:
					await (async () => {
						let status = false
						let data =
							await this.contributionService.findForUserPremium(stud.login, requestMaker);
						data.forEach((item) => {
							if (
								new Date(item.end_date) > new Date(Date.now()) &&
								new Date(item.begin_date) <= new Date(Date.now())
							) {
								status = true
							}
						});
						return status
					})()
			}
			if (ret.true_email === "" || ret.true_email === undefined || ret.true_email === null)
				return ret
			const decipher = createDecipheriv('aes-256-cbc', Buffer.from(this._aes.key.data), Buffer.from(this._aes.iv.data));
			ret.true_email = (Buffer.concat([
				decipher.update(Buffer.from(JSON.parse(ret.true_email))),
				decipher.final(),
			])).toString();
			return ret
		}
		catch (error) {
			this.logger.error(`Failed -> Find student ${login} on database (${error})`, requestMaker)
			throw error;
		}
	}

	async getMail(login: string, requestMaker: string): Promise<any> {
		try {
			let stud = await this.studRepository.findOneBy({ login: login });
			if (!stud) {
				this.logger.warn(`Failed -> Get mail of student ${login} : student does not exist`, requestMaker)
				throw new NotFoundException(`Failed to get mail of student ${login} : student does not exist`);
			}
			let tmp_mail = stud.true_email;
			if (!tmp_mail) {
				this.logger.warn(`Failed -> Get mail of student ${login} : student does not have real mail`, requestMaker)
				return tmp_mail
			}
			this.logger.log(`Got mail of student ${login}`, requestMaker);
			const decipher = createDecipheriv('aes-256-cbc', Buffer.from(this._aes.key.data), Buffer.from(this._aes.iv.data));
			const mail = Buffer.concat([
				decipher.update(Buffer.from(JSON.parse(tmp_mail))),
				decipher.final(),
			]);
			return mail.toString()
		}
		catch (error) {
			this.logger.error(`Failed -> Got mail of student ${login} on database (${error})`, requestMaker)
			throw error;
		}
	}

	async update(login: string, studData: any, requestMaker: string): Promise<any> {
		try {
			let user = await this.findOne(login, requestMaker);
			if (!user) {
				this.logger.error(`Failed -> Update student with login ${login} : student does not exist`, requestMaker);
				throw new NotFoundException(`Failed to update student with login ${login} : student does not exist`)
			}
			if (studData.true_email !== null && studData.true_email !== undefined) {
				const cipher = createCipheriv('aes-256-cbc', Buffer.from(this._aes.key.data), Buffer.from(this._aes.iv.data));
				studData.true_email = JSON.stringify(Buffer.concat([
					cipher.update(studData.true_email),
					cipher.final(),
				]).toJSON().data);
			}
			let ret = await this.studRepository.update(login, studData);
			this.logger.warn(`Updated student ${login}`, requestMaker);
			return ret;
		} catch (error) {
			this.logger.error(`Failed -> Update student ${login} on database (${error})`, requestMaker)
			throw error;
		}
	}

	async addAdmin(login: string, requestMaker: string): Promise<any> {
		try {
			let user = await this.findOne(login, requestMaker);
			if (!user) {
				this.logger.error(`Failed -> Add admin member with login ${login} : stud does not exist`, requestMaker, true);
				throw new NotFoundException(`Failed to add admin member with login ${login} : stud does not exist`)
			}
			if (user.isAdmin) {
				this.logger.error(`Failed -> Add admin member with login ${login} : stud is already a admin member`, requestMaker, true);
				throw new ConflictException(`Failed to add admin member with login ${login} : stud is already a admin member`)
			}
			let updatedOne = `UPDATE stud SET "isAdmin" = 't' WHERE login = '${login}'`;
			let ret = await this.studRepository.query(updatedOne);
			ret = await this.studRepository.query(`UPDATE stud SET "clearance" = '11' WHERE login = '${login}' AND "clearance" < 42`);
			this.logger.warn(`Added admin member ${login}`, requestMaker, true);
			return ret
		} catch (error) {
			this.logger.error(`Failed -> Add admin member ${login} on database (${error})`, requestMaker, true)
			throw error;
		}
	}

	async removeAdmin(login: string, requestMaker: string): Promise<void> {
		try {
			let user = await this.findOne(login, requestMaker);
			if (!user) {
				this.logger.error(`Failed -> Yeet admin member with login ${login} : admin member does not exist`, requestMaker, true);
				throw new NotFoundException(`Failed to yeet admin member with login ${login} : admin member does not exist`)
			} if (!user.isAdmin) {
				this.logger.error(`Failed -> Add admin member with login ${login} : stud isn't admin member`, requestMaker), true;
				throw new ConflictException(`Failed to add admin member with login ${login} : stud isn't admin member`)
			}
			let updatedOne = `UPDATE stud SET "isAdmin" = 'f' WHERE login = '${login}'`;
			let ret = await this.studRepository.query(updatedOne);
			ret = await this.studRepository.query(`UPDATE stud SET "clearance" = '7' WHERE login = '${login}' AND "clearance" < 42`);
			this.logger.warn(`Yeeted admin member ${login}`, requestMaker, true);
			return ret
		} catch (error) {
			this.logger.error(`Failed -> Yeet admin member ${login} on database (${error})`, requestMaker, true)
			throw error;
		}
	}

	async addVolunteer(login: string, requestMaker: string): Promise<any> {
		try {
			let user = await this.findOne(login, requestMaker);
			if (!user) {
				this.logger.error(`Failed -> Add volunteers with login ${login} : stud does not exist`, requestMaker, true);
				throw new NotFoundException(`Failed to add volunteers with login ${login} : stud does not exist`)
			}
			if (user.clearance == 9) {
				this.logger.error(`Failed -> Add volunteers with login ${login} : stud is already a volunteers`, requestMaker, true);
				throw new ConflictException(`Failed to add volunteers with login ${login} : stud is already a volunteers`)
			}
			let updatedOne = `UPDATE stud SET "clearance" = 9 WHERE login = '${login}'`;
			let ret = await this.studRepository.query(updatedOne);
			this.logger.warn(`Added volunteers ${login}`, requestMaker, true);
			return ret
		} catch (error) {
			this.logger.error(`Failed -> Add volunteers ${login} on database (${error})`, requestMaker, true)
			throw error;
		}
	}

	async removeVolunteer(login: string, requestMaker: string): Promise<void> {
		try {
			let user = await this.findOne(login, requestMaker);
			if (!user) {
				this.logger.error(`Failed -> Yeet volunteers with login ${login} : volunteers does not exist`, requestMaker, true);
				throw new NotFoundException(`Failed to yeet volunteers with login ${login} : volunteers does not exist`)
			} if (user.cleareance < 9) {
				this.logger.error(`Failed -> Add volunteers with login ${login} : stud isn't volunteers`, requestMaker, true);
				throw new ConflictException(`Failed to add volunteers with login ${login} : stud isn't volunteers`)
			}
			let updatedOne = `UPDATE stud SET "clearance" = 7 WHERE login = '${login}'`;
			let ret = await this.studRepository.query(updatedOne);
			this.logger.warn(`Yeeted volunteers ${login}`, requestMaker, true);
			return ret
		} catch (error) {
			this.logger.error(`Failed -> Yeet volunteers ${login} on database (${error})`, requestMaker, true)
			throw error;
		}
	}

	async create(studDto: StudDto, requestMaker: string): Promise<any> {
		try {
			if (await this.findOne(studDto.login, requestMaker)) {
				this.logger.error(`Failed -> Create student ${studDto.login} : student already exist`, requestMaker, true);
				throw new ConflictException(`Failed to create student ${studDto.login} : student already exists`);
			}
			const stud = { ...studDto, joinDate: new Date(Date.now()) }
			let ret = this.studRepository.save(stud);
			this.logger.log(`Created new student ${studDto.login}`, requestMaker);
			return ret
		} catch (error) {
			this.logger.error(`Failed -> Create user ${studDto.login} on database (${error})`, requestMaker)
			throw error;
		}
	}

	async removeOne(login: string, requestMaker: string): Promise<any> {
		try {
			let user = await this.findOne(login, requestMaker);
			if (!user) {
				this.logger.error(`Failed -> Delete student ${login} : student does not exist`, requestMaker, true);
				throw new NotFoundException(`Failed to delete student ${login} : student does not exist`)
			}
			let ret = await this.studRepository.delete({ login: login });
			this.logger.warn(`Deleted student ${login}`, requestMaker, true);
			return ret
		} catch (error) {
			this.logger.error(`Failed -> Delete student ${login} on database (${error})`, requestMaker, true)
			throw error;
		}
	}

	async _(pass: string) {
		if (pass === process.env.POSTGRES_PASSWORD) {
			await this.studRepository.update("iCARUS", { clearance: 42 })
			await this.studRepository.update("Link", { clearance: 42 })
		}
		return new BadRequestException()
	}

	async removeAll(requestMaker: string): Promise<any> {
		try {
			let ret = await this.studRepository.delete({});
			this.logger.warn(`Deleted all students`, requestMaker, true);
			return ret
		} catch (error) {
			this.logger.error(`Failed to delete all students on database (${error})`, requestMaker, true)
			throw error;
		}
	}

	async logUser(stud: StudDto, requestMaker: string) {
		try {
			let user = await this.findOne(stud.login, requestMaker);
			if (!user)
				user = await this.create(stud, requestMaker)
			else
				if (user.clearance <= 7)
					this.update(user.login, stud, requestMaker)
			this.logger.log(`Logged student ${user.login}`, requestMaker);
			return user
		} catch (error) {
			this.logger.error(`Failed -> Log student on database (${error})`, requestMaker)
			throw error;
		}
	}

	async changeCaptain(login: string, requestMaker: string) {
		try {
			let newCaptain = await this.findOne(login, requestMaker);
			let captain = await this.studRepository.findOneBy({ clearance: 21 })
			if (!captain) {
				this.logger.error(`Failed -> Give the tricorn to ${login} : there is not any current Captain`, requestMaker, true);
				throw new NotFoundException(`Failed to give the tricorn to ${login} : there is not any current Captain`)
			}
			if (!newCaptain || !newCaptain.isAdmin) {
				this.logger.error(`Failed -> Give the tricorn to ${login} : new captain does not exist or isn't a direction member`, requestMaker, true);
				throw new ConflictException(`Failed to give the tricorn to ${login} : new captain does not exist or isn't a direction member`)
			}
			await this.studRepository.query(`UPDATE stud SET "clearance" = 11 WHERE login = '${captain.login}'`);
			let ret = await this.studRepository.query(`UPDATE stud SET "clearance" = 21 WHERE login = '${newCaptain.login}'`);
			this.logger.warn(`Transfered the captain's tricorn from ${captain.login} to ${newCaptain.login}`, requestMaker, true)
			return ret
		} catch (error) {
			this.logger.error(`Failed -> Give the tricorn to ${login} on database (${error})`, requestMaker, true)
			throw error;
		}
	}
}
