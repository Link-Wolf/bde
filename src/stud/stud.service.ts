import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stud } from '../entity/Stud';
import { StudDto } from './stud.dto';

@Injectable()
export class StudService {
	constructor(
		@InjectRepository(Stud)
		private studRepository: Repository<Stud>,
		// private readonly logger = new Logger()// CustomLogger
	) { }

	findAll(): Promise<Stud[]> {
		return this.studRepository.find();
	}

	async findOne(login: string): Promise<Stud> {
		let stud = await this.studRepository.findOneBy({ login: login });
		if (!stud) {
			Logger.warn(`No user found with login >${login}<`)
			throw new NotFoundException()
		}
		return stud
	}

	async update(login: string, studData: any): Promise<void> {
		try {
			await this.studRepository.update(login, studData);
		} catch (error) {
			Logger.error(`Failed to update user >${login}<`)
			throw new NotFoundException(error)
		}
	}

	async create(studDto: StudDto): Promise<void> {
		//TODO: si le pelot existe deja -> check
		try {
			await this.studRepository.save(studDto);
		} catch (error) {
			Logger.error(`Failed to create user >${studDto.login}<`)
			throw new NotFoundException(error)
		}
	}

	async removeOne(login: string): Promise<void> {
		try {
			await this.studRepository.delete({ login: login });
		} catch (error) {
			Logger.error(`Failed to delete user >${login}<`)
			throw new NotFoundException(error)
		}
	}

	async removeAll(): Promise<void> {
		await this.studRepository.delete({});
	}
}
