import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contribution } from '../entity/Contribution';
import { CustomLogger } from '../logger/CustomLogger.class';
import { StudService } from '../stud/stud.service';
import { ContributionDto } from './contribution.dto';

@Injectable()
export class ContributionService {
	private readonly logger = new CustomLogger();

	constructor(
		@InjectRepository(Contribution)
		private contributionRepository: Repository<Contribution>,
		private studService: StudService,
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

	async update(studLogin: string, contribution: any): Promise<void> {
		let cont = await this.findOne(studLogin)
		if (!cont) {
			this.logger.error(`Failed on update contuser ${studLogin}`)
		}
		await this.contributionRepository.update(studLogin, contribution);
	}

	async create(contributionData: ContributionDto): Promise<void> {
		console.log(contributionData)
		await this.contributionRepository.save(contributionData);
		this.studService.update(contributionData.stud.login, { isPremium: true });
	}

	async removeOne(studLogin: string): Promise<void> {
		await this.contributionRepository.delete({ studLogin: studLogin });
	}

	async removeAll(): Promise<void> {
		await this.contributionRepository.delete({});
	}
}
