import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inscription } from './inscription.entity';

@Injectable()
export class InscriptionService {
	constructor(
		@InjectRepository(Inscription)
		private usersRepository: Repository<Inscription>,
	) { }

	findAll(): Promise<Inscription[]> {
		return this.usersRepository.find();
	}

	findOne(id: number): Promise<Inscription> {
		return this.usersRepository.findOneBy({ id: id });
	}

	async create(inscription: Inscription): Promise<void> {
		this.usersRepository.save(inscription);
	}

	async remove(id: number): Promise<void> {
		await this.usersRepository.delete({ id: id });
	}
}
