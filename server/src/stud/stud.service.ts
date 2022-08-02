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

	async findOne(login: string, requestMaker: string): Promise<Stud> {
		try {
			let stud = await this.studRepository.findOneBy({ login: login });
			if (stud)
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

	async update(login: string, studData: any, requestMaker: string): Promise<void> {
		try {
			let user = await this.findOne(login, requestMaker);
			if (!user) {
				this.logger.error(`Failed to update student with login ${login} : student does not exist`, requestMaker);
				throw new NotFoundException(`Failed to update student with login ${login} : student does not exist`)
			}
			await this.studRepository.update(login, studData);
			this.logger.warn(`Successfully updated student ${login}`, requestMaker);
		} catch (error) {
			this.logger.error(`Failed to update student ${login} on database (${error})`, requestMaker)
			throw new NotFoundException(`Failed to update student ${login} on database (${error})`)
		}
	}

	async updateDirection(login: string, requestMaker: string): Promise<void> {
		try {
			let user = await this.findOne(login, requestMaker);
			if (!user) {
				this.logger.error(`Failed to yeet direction member with login ${login} : direction member does not exist`, requestMaker);
				throw new NotFoundException(`Failed to yeet direction member with login ${login} : direction member does not exist`)
			}
			let updatedOne = `UPDATE stud SET "isDirection" = ${!user.isDirection} WHERE login = '${login}'`;
			console.log(updatedOne)
			await this.studRepository.query(updatedOne);
			this.logger.warn(`Successfully yeet direction member ${login}`, requestMaker);
		} catch (error) {
			this.logger.error(`Failed to yeet direction member ${login} on database (${error})`, requestMaker)
			throw new NotFoundException(`Failed to yeet direction member ${login} on database (${error})`)
		}
	}

	async create(studDto: StudDto, requestMaker: string): Promise<any> {
		try {
			if (await this.findOne(studDto.login, requestMaker)) {
				throw new ConflictException(`Failed to create student ${studDto.login} : student already exists`);
			}
			let ret = this.studRepository.save(studDto);
			this.logger.log(`Successfully created new student ${studDto.login}`, requestMaker);
		} catch (error) {
			this.logger.error(`Failed to create user ${studDto.login} on database (${error})`, requestMaker)
			throw new NotFoundException(`Failed to create user ${studDto.login} on database (${error})`)
		}
	}

	async removeOne(login: string, requestMaker: string): Promise<void> {
		try {
			let user = await this.findOne(login, requestMaker);
			if (!user)
				this.logger.warn(`Failed to delete student ${login} : student does no exist`, requestMaker);
			else
				this.logger.warn(`Successfully delete student ${login}`, requestMaker);
			await this.studRepository.delete({ login: login });
		} catch (error) {
			this.logger.error(`Failed to delete student ${login} on database (${error})`, requestMaker)
			throw new NotFoundException(`Failed to delete student ${login} on database (${error})`)
		}
	}

	async removeAll(requestMaker: string): Promise<void> {
		try {
			await this.studRepository.delete({});
			this.logger.warn(`Successfully deleted all students`, requestMaker);
		} catch (error) {
			this.logger.error(`Failed to delete all students on database (${error})`, requestMaker)
			throw new NotFoundException(`Failed to delete all students on database (${error})`)
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
			throw new NotFoundException(`log student on database (${error})`)
		}
	}
}
