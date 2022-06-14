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
			this.logger.error(`Failed to get all students (${error})`)
			throw new InternalServerErrorException(`Failed to get all students (${error})`);
		}
	}

	async findOne(login: string): Promise<Stud> {
		try {
			let stud = await this.studRepository.findOneBy({ login: login });
			if (!stud) {
				this.logger.warn(`No student found with login ${login}`)
			}
			else
				this.logger.log(`Got student with login ${login}`);
			return stud
		}
		catch (error) {
			this.logger.error(`Failed to find student ${login} (${error})`)
			throw new InternalServerErrorException(`Failed to find student ${login} (${error})`);
		}
	}

	async update(login: string, studData: any): Promise<void> {
		try {
			let user = await this.findOne(login);
			if (!user) {
				this.logger.error(`Failed to update student with login ${login}, student does not exist`);
				throw new NotFoundException(`Failed to update student with login ${login}, student does not exist`)
			}
			await this.studRepository.update(login, studData);
			this.logger.log(`Successfully updated student ${login}`);
		} catch (error) {
			this.logger.error(`Failed to update student ${login} on database (${error})`)
			throw new NotFoundException(`Failed to update student ${login} on database (${error})`)
		}
	}

	async create(studDto: StudDto): Promise<void> {
		try {
			if (await this.findOne(studDto.login)) {
				throw new ConflictException(`Failed to create student ${studDto.login}, student already exists`);
			}
			await this.studRepository.save(studDto);
			this.logger.log(`Successfully created new student ${studDto.login}`);
		} catch (error) {
			this.logger.error(`Failed to create user ${studDto.login} (${error})`)
			throw new NotFoundException(`Failed to create user ${studDto.login} (${error})`)
		}
	}

	async removeOne(login: string): Promise<void> {
		try {
			let user = await this.findOne(login);
			if (!user)
				this.logger.warn(`Failed to delete student ${login} : student does no exist`);
			else
				this.logger.log(`Successfully delete student ${login}`);
			await this.studRepository.delete({ login: login });
		} catch (error) {
			this.logger.error(`Failed to delete student ${login} on database (${error})`)
			throw new NotFoundException(`Failed to delete student ${login} on database (${error})`)
		}
	}

	async removeAll(): Promise<void> {
		try {
			await this.studRepository.delete({});
			this.logger.log(`Successfully deleted all students`);
		} catch (error) {
			this.logger.error(`Failed to delete all students (${error})`)
			throw new NotFoundException(`Failed to delete all students (${error})`)
		}
	}
}
