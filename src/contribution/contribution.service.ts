import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contribution } from '../entity/Contribution';
import { StudService } from '../stud/stud.service';
import { ContributionDto, ContributionUpdateDto } from './contribution.dto';

@Injectable()
export class ContributionService {
	private readonly logger = new Logger(ContributionService.name)

	constructor(
		@InjectRepository(Contribution)
		private contributionRepository: Repository<Contribution>,
		private studService: StudService
	) { }

	findAll(): Promise<Contribution[]> {
		return this.contributionRepository.find();
	}

	findOne(studLogin: string): Promise<Contribution> {
		return this.contributionRepository.findOne({
			where: { studLogin: studLogin },
			order: { begin_date: "DESC" },
		});
	}

	async update(studLogin: string, contribution: ContributionUpdateDto): Promise<void> {
		try {
			await this.contributionRepository.update(studLogin, contribution);
		} catch (error) {
			this.logger.error(`Failed on update user ${studLogin}`)
		}
	}

	async create(contributionData: ContributionDto): Promise<void> {
		await this.contributionRepository.save(contributionData);
		this.studService.update(contributionData.studLogin, { isPremium: true });
	}

	async removeOne(studLogin: string): Promise<void> {
		await this.contributionRepository.delete({ studLogin: studLogin });
	}

	async removeAll(): Promise<void> {
		await this.contributionRepository.delete({});
	}
}
