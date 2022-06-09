import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stud } from '../entity/Stud';
import { StudDto } from './stud.dto';

@Injectable()
export class StudService {
	private readonly logger = new Logger(StudService.name)

	constructor(
		@InjectRepository(Stud)
		private studRepository: Repository<Stud>,
	) { }

	findAll(): Promise<Stud[]> {
		return this.studRepository.find();
	}

	findOne(login: string): Promise<Stud> {
		return this.studRepository.findOneBy({ login: login });
	}

	async update(login: string, studData: any): Promise<void> {
		//var old_stud = await this.findOne(login);
		await this.studRepository.update(login, studData);
	}

	async create(studDto: StudDto): Promise<void> {
		await this.studRepository.save(studDto);
	}

	async removeOne(login: string): Promise<void> {
		await this.studRepository.delete({ login: login });
	}

	async removeAll(): Promise<void> {
		await this.studRepository.delete({});
	}
}
