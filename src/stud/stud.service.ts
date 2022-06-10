<<<<<<< HEAD
import { Injectable } from '@nestjs/common';
=======
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
>>>>>>> 5e6dec6f3f493891a9431b03fb5a7b20ca1432e6
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stud } from '../entity/Stud';
import { StudDto } from './stud.dto';

@Injectable()
export class StudService {

	constructor(
		@InjectRepository(Stud)
		private studRepository: Repository<Stud>,
<<<<<<< HEAD
=======
		private readonly logger = new Logger()// CustomLogger
>>>>>>> 5e6dec6f3f493891a9431b03fb5a7b20ca1432e6
	) { }

	findAll(): Promise<Stud[]> {
		return this.studRepository.find();
	}

	findOne(login: string): Promise<Stud> {
		return this.studRepository.findOneBy({ login: login });
	}

	async update(login: string, studData: any): Promise<void> {
		var stud = await this.findOne(login);
		if (!stud) {
			//ERROR: there is no stud ${login}
		}
		await this.studRepository.update(stud, studData);
	}

	async create(studDto: StudDto): Promise<void> {
		await this.studRepository.save(studDto);
	}

	async removeOne(login: string): Promise<void> {
		var stud = await this.findOne(login);
		if (!stud) {
			//ERROR: there is no stud ${login}
		}
		await this.studRepository.delete({ login: login });
	}

	async removeAll(): Promise<void> {
		await this.studRepository.delete({});
	}
}
