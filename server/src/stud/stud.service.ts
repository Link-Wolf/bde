import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Stud } from '../entity/Stud';
import { LoggerService } from '../logger/logger.service';
import { StudDto } from './stud.dto';

@Injectable()
export class StudService {
	constructor(
		@InjectRepository(Stud)
		private studRepository: Repository<Stud>,
		private readonly logger: LoggerService
	) { }

	async findAll(requestMaker: string): Promise<Stud[]> {
		try {
			let studs = await this.studRepository.find();
			// if (studs.length == 0) {
			// 	this.logger.warn(`No stud found`)
			// }
			// else
			this.logger.log(`Got all students`, requestMaker);
			return studs;
		}
		catch (error) {
			this.logger.error(`Failed to get all students on database (${error})`, requestMaker)
			throw new InternalServerErrorException(`Failed to get all students on database (${error})`);
		}
	}

	async findDirection(requestMaker: string): Promise<Stud[]> {
		try {
			let studs = await this.studRepository.findBy({
				isDirection: true,
				clearance: Not(21)
			});
			this.logger.log(`Got all direction members`, requestMaker);
			return studs;
		}
		catch (error) {
			this.logger.error(`Failed to get all direction members on database (${error})`, requestMaker)
			throw new InternalServerErrorException(`Failed to get all direction members on database (${error})`);
		}
	}

	async findNoDirection(requestMaker: string): Promise<Stud[]> {
		try {
			let studs = await this.studRepository.findBy({
				isDirection: false,
			});
			this.logger.log(`Got all non-direction members`, requestMaker);
			return studs;
		}
		catch (error) {
			this.logger.error(`Failed to get all non-direction members on database (${error})`, requestMaker)
			throw new InternalServerErrorException(`Failed to get all non-direction members on database (${error})`);
		}
	}

	async findOne(login: string, requestMaker: string): Promise<Stud> {
		try {
			let stud = await this.studRepository.findOneBy({ login: login });
			if (!stud)
				throw new NotFoundException(`Failed to find student ${login}`)
			// 	this.logger.warn(`Failed to find student with login ${login} : student does not exist`)
			// }
			// else
			this.logger.log(`Got student with login ${login}`, requestMaker);
			return stud
		}
		catch (error) {
			this.logger.error(`Failed to find student ${login} on database (${error})`, requestMaker)
			throw new InternalServerErrorException(`Failed to find student ${login} on database (${error})`);
		}
	}

	async update(login: string, studData: any, requestMaker: string): Promise<any> {
		try {
			let user = await this.findOne(login, requestMaker);
			if (!user) {
				this.logger.error(`Failed to update student with login ${login} : student does not exist`, requestMaker);
				throw new NotFoundException(`Failed to update student with login ${login} : student does not exist`)
			}
			let ret = await this.studRepository.update(login, studData);
			this.logger.warn(`Successfully updated student ${login}`, requestMaker);
			return ret;
		} catch (error) {
			this.logger.error(`Failed to update student ${login} on database (${error})`, requestMaker)
			throw new InternalServerErrorException(`Failed to update student ${login} on database (${error})`)
		}
	}

	async addDirection(login: string, requestMaker: string): Promise<any> {
		try {
			let user = await this.findOne(login, requestMaker);
			if (!user) {
				this.logger.error(`Failed to add direction member with login ${login} : stud does not exist`, requestMaker);
				throw new NotFoundException(`Failed to add direction member with login ${login} : stud does not exist`)
			}
			if (user.isDirection) {
				this.logger.error(`Failed to add direction member with login ${login} : stud is already a direction member`, requestMaker);
				throw new InternalServerErrorException(`Failed to add direction member with login ${login} : stud is already a direction member`)
			}
			let updatedOne = `UPDATE stud SET "isDirection" = 't', "clearance" = 11 WHERE login = '${login}'`;
			let ret = await this.studRepository.query(updatedOne);
			this.logger.warn(`Successfully add direction member ${login}`, requestMaker);
			return ret
		} catch (error) {
			this.logger.error(`Failed to add direction member ${login} on database (${error})`, requestMaker)
			throw new InternalServerErrorException(`Failed to add direction member ${login} on database (${error})`)
		}
	}

	async removeDirection(login: string, requestMaker: string): Promise<void> {
		try {
			let user = await this.findOne(login, requestMaker);
			if (!user) {
				this.logger.error(`Failed to yeet direction member with login ${login} : direction member does not exist`, requestMaker);
				throw new NotFoundException(`Failed to yeet direction member with login ${login} : direction member does not exist`)
			} if (!user.isDirection) {
				this.logger.error(`Failed to add direction member with login ${login} : stud isn't direction member`, requestMaker);
				throw new InternalServerErrorException(`Failed to add direction member with login ${login} : stud isn't direction member`)
			}
			let updatedOne = `UPDATE stud SET "isDirection" = 'f', "clearance" = 7 WHERE login = '${login}'`;
			let ret = await this.studRepository.query(updatedOne);
			this.logger.warn(`Successfully yeet direction member ${login}`, requestMaker);
			return ret
		} catch (error) {
			this.logger.error(`Failed to yeet direction member ${login} on database (${error})`, requestMaker)
			throw new InternalServerErrorException(`Failed to yeet direction member ${login} on database (${error})`)
		}
	}

	async create(studDto: StudDto, requestMaker: string): Promise<any> {
		try {
			if (await this.findOne(studDto.login, requestMaker)) {
				throw new ConflictException(`Failed to create student ${studDto.login} : student already exists`);
			}
			let ret = this.studRepository.save(studDto);
			this.logger.log(`Successfully created new student ${studDto.login}`, requestMaker);
			return ret
		} catch (error) {
			this.logger.error(`Failed to create user ${studDto.login} on database (${error})`, requestMaker)
			throw new InternalServerErrorException(`Failed to create user ${studDto.login} on database (${error})`)
		}
	}

	async removeOne(login: string, requestMaker: string): Promise<any> {
		try {
			let user = await this.findOne(login, requestMaker);
			if (!user)
				throw new NotFoundException(`stud ${login} does not exist`)
			let ret = await this.studRepository.delete({ login: login });
			this.logger.warn(`Successfully delete student ${login}`, requestMaker);
			return ret
		} catch (error) {
			this.logger.error(`Failed to delete student ${login} on database (${error})`, requestMaker)
			throw new NotFoundException(`Failed to delete student ${login} on database (${error})`)
		}
	}

	async removeAll(requestMaker: string): Promise<any> {
		try {
			let ret = await this.studRepository.delete({});
			this.logger.warn(`Successfully deleted all students`, requestMaker);
			return ret
		} catch (error) {
			this.logger.error(`Failed to delete all students on database (${error})`, requestMaker)
			throw new InternalServerErrorException(`Failed to delete all students on database (${error})`)
		}
	}

	async logUser(stud: StudDto, requestMaker: string) {
		try {
			let user = await this.findOne(stud.login, requestMaker);
			if (!user)
				user = await this.create(stud, requestMaker)
			this.logger.log(`Successfully logged student`, requestMaker);
			return user
		} catch (error) {
			this.logger.error(`Failed to log student on database (${error})`, requestMaker)
			throw new InternalServerErrorException(`Failed to log student on database (${error})`)
		}
	}

	async changeCaptain(login: string, requestMaker: string) {
		try {
			let newCaptain = await this.findOne(login, requestMaker);
			let captain = await this.studRepository.findOneBy({ clearance: 21 })
			if (!captain) {
				this.logger.error(`Failed to give the tricorn to ${login} : there is not any current Captain`, requestMaker);
				throw new NotFoundException(`Failed to give the tricorn to ${login} : there is not any current Captain`)
			}
			if (!newCaptain || !newCaptain.isDirection) {
				this.logger.error(`Failed to give the tricorn to ${login} : new captain does not exist or isn't a direction member`, requestMaker);
				throw new NotFoundException(`Failed to give the tricorn to ${login} : new captain does not exist or isn't a direction member`)
			}
			await this.studRepository.query(`UPDATE stud SET "clearance" = 11 WHERE login = '${captain.login}'`);
			let ret = await this.studRepository.query(`UPDATE stud SET "clearance" = 21 WHERE login = '${newCaptain.login}'`);
			this.logger.warn(`Successfully transfered the captain's tricorn from ${captain.login} to ${newCaptain.login}`, requestMaker)
			return ret
		} catch (error) {
			this.logger.error(`Failed to give the tricorn to ${login} on database (${error})`, requestMaker)
			throw new InternalServerErrorException(`Failed to give the tricorn to ${login} on database (${error})`)
		}
	}
}
