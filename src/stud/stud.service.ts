import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

	findAll(): Promise<Stud[]> {
		try {
			let studs = this.studRepository.find();
			this.logger.log(`Get all students`)
			return studs;
		}
		catch {
			this.logger.error(`lol nop`)
			throw new InternalServerErrorException();
		}
	}

	async findOne(login: string): Promise<Stud> {
		try {
			let stud = await this.studRepository.findOneBy({ login: login });
			if (!stud) {
				this.logger.warn(`No stud found with login >${login}<`)
			}
			this.logger.log(`Finding user ${login}`);
			return stud
		}
		catch {
			this.logger.error(`lol nop`)
			throw new InternalServerErrorException();
		}
	}

	async update(login: string, studData: any): Promise<void> {
		try {
			await this.studRepository.update(login, studData);
			this.logger.log(`Update stud ${login} with value ${studData}`);
		} catch (error) {
			this.logger.error(`Failed to update user >${login}<`)
			throw new NotFoundException(error)
		}
	}

	async create(studDto: StudDto): Promise<void> {
		//TODO: si le pelot existe deja -> check
		try {
			await this.studRepository.save(studDto);
			this.logger.log(`Create stud ${studDto.login} with value ${studDto}`);
		} catch (error) {
			this.logger.error(`Failed to create user >${studDto.login}<`)
			throw new NotFoundException(error)
		}
	}

	async removeOne(login: string): Promise<void> {
		try {
			await this.studRepository.delete({ login: login });
		} catch (error) {
			this.logger.error(`Failed to delete user >${login}<`)
			throw new NotFoundException(error)
		}
	}

	async removeAll(): Promise<void> {
		await this.studRepository.delete({});
	}
}
