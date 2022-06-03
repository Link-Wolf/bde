import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contribution } from '../entity/Contribution';
import { UserService } from '../user/user.service';
import { ContributionDto } from './contribution.dto';

@Injectable()
export class ContributionService {
	constructor(
		@InjectRepository(Contribution)
		private contributionRepository: Repository<Contribution>,
		private userService: UserService
	) { }

	findAll(): Promise<Contribution[]> {
		return this.contributionRepository.find();
	}

	findOne(userLogin: string): Promise<Contribution> {
		return this.contributionRepository.findOneBy({ userLogin: userLogin });
	}

	async create(contribution: ContributionDto): Promise<void> {
		let today = new Date(Date.now());
		let due = new Date(Date.now());
		due.setMonth(due.getMonth() + 6)
		await this.contributionRepository.save({
			userLogin: contribution.user,
			begin_date: today,
			cost: 10,
			end_date: due,
			user: await this.userService
				.findOne(contribution.user)
		});
	}

	async removeOne(userLogin: string): Promise<void> {
		await this.contributionRepository.delete({ userLogin: userLogin });
	}

	async removeAll(): Promise<void> {
		await this.contributionRepository.delete({});
	}
}
