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
			if (studs.length == 0) {
				this.logger.warn(`No stud found`)
			}
			else
				this.logger.log(`Find users`);
			return studs;
		}
		catch (error) {
			this.logger.error(`Could not find students : ${error}`)
			throw new InternalServerErrorException(`Could not find students : ${error}`);
		}
	}

	async findOne(login: string): Promise<Stud> {
		try {
			let stud = await this.studRepository.findOneBy({ login: login });
			if (!stud) {
				this.logger.warn(`No stud found with login ${login}`)
			}
			else
				this.logger.log(`Find user ${login}`);
			return stud
		}
		catch (error) {
			this.logger.error(`Could not find student ${login} : ${error}`)
			throw new InternalServerErrorException(`Could not find student ${login} : ${error}`);
		}
	}

	async update(login: string, studData: any): Promise<void> {
		try {
			let user = await this.findOne(login);
			if (!user) {
				throw new NotFoundException(`User does not exist`)
			}
			await this.studRepository.update(login, studData);
			this.logger.log(`Update stud ${login}`);
		} catch (error) {
			this.logger.error(`Failed to update user ${login} : ${error}`)
			throw new NotFoundException(`Failed to update user ${login} : ${error}`)
		}
	}

	async create(studDto: StudDto): Promise<void> {
		try {
			if (await this.findOne(studDto.login)) {
				throw new ConflictException(`User ${studDto.login} already exists`);
			}
			await this.studRepository.save(studDto);
			this.logger.log(`Create student ${studDto.login}`);
		} catch (error) {
			this.logger.error(`Failed to create user ${studDto.login} : ${error}`)
			throw new NotFoundException(`Failed to create user ${studDto.login} : ${error}`)
		}
	}

	async removeOne(login: string): Promise<void> {
		try {
			let user = await this.findOne(login);
			if (!user)
				this.logger.warn(`Cannot delete user ${login}`);
			else
				this.logger.log(`Delete user ${login}`);
			await this.studRepository.delete({ login: login });
		} catch (error) {
			this.logger.error(`Failed to delete user ${login} : ${error}`)
			throw new NotFoundException(`Failed to delete user ${login} : ${error}`)
		}
	}

	async removeAll(): Promise<void> {
		try {
			await this.studRepository.delete({});
			this.logger.log(`Delete users`);
		} catch (error) {
			this.logger.error(`Failed to delete users : ${error}`)
			throw new NotFoundException(`Failed to delete users : ${error}`)
		}
	}
}
