import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contribution } from '../entity/Contribution';
import { ContributionDto } from './contribution.dto';

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

	async create(contribution: ContributionDto): Promise<void> {
		this.usersRepository.save({
			begin_date: Date.now(),
			cost: Number(contribution.cost),
			end_date: Date.now(),
		});
	}

	async removeOne(id: number): Promise<void> {
		await this.usersRepository.delete({ id: id });
	}

	async removeAll(): Promise<void> {
		await this.usersRepository.delete({});
	}
}
