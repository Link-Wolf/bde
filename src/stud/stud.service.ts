import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stud } from '../entity/Stud';
import { CustomLogger } from '../logger/CustomLogger.class';
import { StudDto } from './stud.dto';

@Injectable()
export class StudService {
	private readonly logger = new CustomLogger()

	constructor(
		@InjectRepository(Stud)
		private studRepository: Repository<Stud>,
	) { }

	findAll(): Promise<Stud[]> {
		return this.studRepository.find();
	}

	async findOne(login: string): Promise<Stud> {
		let stud = await this.studRepository.findOneBy({ login: login });
		if (!stud) {
			this.logger.warn(`No user found with login >${login}<`)
			throw new NotFoundException()
		}
		return stud
	}

	async update(login: string, studData: any): Promise<void> {
		try {
			await this.studRepository.update(login, studData);
		} catch (error) {
			this.logger.error(`Failed to update user >${login}<`)
			throw new NotFoundException(error)
		}
	}

	async create(studDto: StudDto): Promise<void> {
		//TODO: si le pelot existe deja -> check
		try {
			await this.studRepository.save(studDto);
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
