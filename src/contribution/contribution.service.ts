import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contribution } from '../entity/Contribution';
import { LoggerService } from '../logger/logger.service';
import { StudService } from '../stud/stud.service';
import { ContributionDto } from './contribution.dto';

@Injectable()
export class ContributionService {

	constructor(
		@InjectRepository(Contribution)
		private contributionRepository: Repository<Contribution>,
		private studService: StudService,
		private logger: LoggerService,
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
			this.logger.error(`no contribution for that student`);
		}
		await this.contributionRepository.update(cont, contribution);
	}

	async create(contributionData: ContributionDto): Promise<void> {
		if (!contributionData.stud) {
			this.logger.error(`student not founded`);
		}
		await this.contributionRepository.save(contributionData);
		this.studService.update(contributionData.stud.login, { isPremium: true });
	}

	async removeOne(studLogin: string): Promise<void> {
		let cont = await this.findOne(studLogin)
		if (!cont) {
			this.logger.error(`no contribution for that student`);
		}
		await this.contributionRepository.delete({ studLogin: studLogin });
	}

	async removeAll(): Promise<void> {
		await this.contributionRepository.delete({});
	}
}
