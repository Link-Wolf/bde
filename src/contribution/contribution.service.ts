import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
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

	async findAll(): Promise<Contribution[]> {
		try {
			return this.contributionRepository.find();
		}
		catch{
			await this.logger.error(`ptdr tu pue]`);
			throw new UnprocessableEntityException(`ptdr tu pue]`);
		}
	}

	async findOne(studLogin: string): Promise<Contribution> {
		return this.contributionRepository.findOne({
			where: { studLogin: studLogin },
			order: { begin_date: "DESC" },
		});
		// TODO: if null -> warn / try catch-> err UnprocessableEntityException
	}

	async update(studLogin: string, contribution: any): Promise<void> {
		let cont = await this.findOne(studLogin)
		if (!cont) {
			await this.logger.error(`Failed to update contribution, student ${studLogin} does not exist or does not have any contribution`);
			throw new NotFoundException(`Failed to update contribution, student ${studLogin} does not exist or does not have any contribution`);
		}
		try {
			await this.contributionRepository.update(cont, contribution);
		}
		catch {
			await this.logger.error(`Failed to update contribution of student ${studLogin} on database`);
			throw new UnprocessableEntityException(`Failed to update contribution of student ${studLogin} on database`);
		}
	}

	async create(contributionData: ContributionDto): Promise<void> {
		await this.contributionRepository.save(contributionData);
		try {
			this.studService.update(contributionData.stud.login, { isPremium: true });
		}
		catch {
			await this.logger.error(`Failed to update contribution of student ${contributionData.stud.login} on database`);
			throw new UnprocessableEntityException(`Failed to update contribution of student ${contributionData.stud.login} on database`);
		}
	}

	async removeOne(studLogin: string): Promise<void> {
		let cont = await this.findOne(studLogin)
		if (!cont) {
			await this.logger.warn(`lol stud exists pas`);
			throw new NotFoundException(`lol stud exists pas`);
		}
		await this.contributionRepository.delete({ studLogin: studLogin });
		//TODO: faire un find avant et warn si pas de contrib pour l'user / try catch err UnprocessableEntityException
	}

	async removeAll(): Promise<void> {
		await this.contributionRepository.delete({});
		//TODO: try catch err UnprocessableEntityException
	}
}
