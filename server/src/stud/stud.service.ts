import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

	async findAll(): Promise<Stud[]> {
		try {
			let studs = await this.studRepository.find();
			// if (studs.length == 0) {
			// 	this.logger.warn(`No stud found`)
			// }
			// else
			this.logger.log(`Got all students`);
			return studs;
		}
		catch (error) {
			this.logger.error(`Failed to get all students on database (${error})`)
			throw new InternalServerErrorException(`Failed to get all students on database (${error})`);
		}
	}

	async findOne(login: string): Promise<Stud> {
		try {
			let stud = await this.studRepository.findOneBy({ login: login });
			if (stud)
				// 	this.logger.warn(`Failed to find student with login ${login} : student does not exist`)
				// }
				// else
				this.logger.log(`Got student with login ${login}`);
			return stud
		}
		catch (error) {
			this.logger.error(`Failed to find student ${login} on database (${error})`)
			throw new InternalServerErrorException(`Failed to find student ${login} on database (${error})`);
		}
	}

	async update(login: string, studData: any): Promise<void> {
		try {
			let user = await this.findOne(login);
			if (!user) {
				this.logger.error(`Failed to update student with login ${login} : student does not exist`);
				throw new NotFoundException(`Failed to update student with login ${login} : student does not exist`)
			}
			await this.studRepository.update(login, studData);
			this.logger.warn(`Successfully updated student ${login}`);
		} catch (error) {
			this.logger.error(`Failed to update student ${login} on database (${error})`)
			throw new NotFoundException(`Failed to update student ${login} on database (${error})`)
		}
	}

	async create(studDto: StudDto): Promise<any> {
		try {
			if (await this.findOne(studDto.login)) {
				throw new ConflictException(`Failed to create student ${studDto.login} : student already exists`);
			}
			this.logger.log(`Successfully created new student ${studDto.login}`);
			return this.studRepository.save(studDto);
		} catch (error) {
			this.logger.error(`Failed to create user ${studDto.login} on database (${error})`)
			throw new NotFoundException(`Failed to create user ${studDto.login} on database (${error})`)
		}
	}

	async removeOne(login: string): Promise<void> {
		try {
			let user = await this.findOne(login);
			if (!user)
				this.logger.warn(`Failed to delete student ${login} : student does no exist`);
			else
				this.logger.warn(`Successfully delete student ${login}`);
			await this.studRepository.delete({ login: login });
		} catch (error) {
			this.logger.error(`Failed to delete student ${login} on database (${error})`)
			throw new NotFoundException(`Failed to delete student ${login} on database (${error})`)
		}
	}

	async removeAll(): Promise<void> {
		try {
			await this.studRepository.delete({});
			this.logger.warn(`Successfully deleted all students`);
		} catch (error) {
			this.logger.error(`Failed to delete all students on database (${error})`)
			throw new NotFoundException(`Failed to delete all students on database (${error})`)
		}
	}

	async logUser(stud: StudDto) {
		try {
			let user = this.findOne(stud.login);
			if (!user)
				user = await this.create(stud)
			this.logger.log(`Successfully logged student`);
			return user
		} catch (error) {
			this.logger.error(`Failed to log student on database (${error})`)
			throw new NotFoundException(`log student on database (${error})`)
		}
	}
}
