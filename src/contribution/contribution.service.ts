import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contribution } from './contribution.entity';

@Injectable()
export class ContributionService {
	constructor(
		@InjectRepository(Contribution)
		private usersRepository: Repository<Contribution>,
	) { }

	findAll(): Promise<Contribution[]> {
		return this.usersRepository.find();
	}

	findOne(id: number): Promise<Contribution> {
		return this.usersRepository.findOneBy({ id: id });
	}

	async create(contribution: Contribution): Promise<void> {
		this.usersRepository.save(contribution);
	}

	async remove(id: number): Promise<void> {
		await this.usersRepository.delete({ id: id });
	}
}
