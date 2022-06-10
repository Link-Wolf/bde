import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contribution } from '../entity/Contribution';
import { StudService } from '../stud/stud.service';
import { ContributionDto } from './contribution.dto';

@Injectable()
export class ContributionService {

	constructor(
		@InjectRepository(Contribution)
		private contributionRepository: Repository<Contribution>,
<<<<<<< HEAD
		private studService: StudService
=======
		private studService: StudService,
		private readonly logger = new Logger()//CustomLogger
>>>>>>> 5e6dec6f3f493891a9431b03fb5a7b20ca1432e6
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
			//ERROR: ${studLogin} has no contribution
		}
		await this.contributionRepository.update(cont, contribution);
	}

	async create(contributionData: ContributionDto): Promise<void> {
		if (!contributionData.stud) {
			//ERROR: stud does not exist
		}
		await this.contributionRepository.save(contributionData);
		this.studService.update(contributionData.stud.login, { isPremium: true });
	}

	async removeOne(studLogin: string): Promise<void> {
		let cont = await this.findOne(studLogin)
		if (!cont) {
			//ERROR: ${studLogin} has no contribution
		}
		await this.contributionRepository.delete({ studLogin: studLogin });
	}

	async removeAll(): Promise<void> {
		await this.contributionRepository.delete({});
	}
}
