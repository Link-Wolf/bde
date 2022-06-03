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

	findOne(userLogin: string): Promise<Contribution> {
		return this.usersRepository.findOneBy({ userLogin: userLogin });
	}

	async create(contribution: ContributionDto): Promise<void> {
		this.usersRepository.save({
			begin_date: new Date(Date.now()),
			cost: Number(contribution.cost),
			end_date: new Date(Date.now()),
		});
	}

	async removeOne(userLogin: string): Promise<void> {
		await this.usersRepository.delete({ userLogin: userLogin });
	}

	async removeAll(): Promise<void> {
		await this.usersRepository.delete({});
	}
}
