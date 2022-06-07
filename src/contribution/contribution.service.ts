import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contribution } from '../entity/Contribution';
import { UserService } from '../user/user.service';
import { ContributionDto, ContributionUpdateDto } from './contribution.dto';

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
		return this.contributionRepository.findOne({
			where: { userLogin: userLogin },
			order: { begin_date: "DESC" },
		});
	}

	async update(userLogin: string, contribution: ContributionUpdateDto): Promise<void> {
		await this.contributionRepository.update(userLogin, contribution);
	}

	async create(contributionData: ContributionDto): Promise<void> {
		await this.contributionRepository.save(contributionData);
		this.userService.update(contributionData.userLogin, { isPremium: true });
	}

	async removeOne(userLogin: string): Promise<void> {
		await this.contributionRepository.delete({ userLogin: userLogin });
	}

	async removeAll(): Promise<void> {
		await this.contributionRepository.delete({});
	}
}
