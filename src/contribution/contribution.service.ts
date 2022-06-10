import { Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
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
			let contribs = this.contributionRepository.find();
			await this.logger.log(`Got all contributions`);
			return contribs
		} catch (error) {
			await this.logger.error(`Failed to get all contributions`);
			throw new InternalServerErrorException(`Failed to get all contributions (${error})`);
		}
	}

	async findOne(studLogin: string): Promise<Contribution> {
		try {
			let cont = await this.contributionRepository.findOne({
				where: { studLogin: studLogin },
				order: { begin_date: "DESC" },
			});
			if (!cont)
				this.logger.warn(`No contribution found for student ${studLogin}`)
			else
				this.logger.log(`Got last contribution of student ${studLogin}`)
			return cont
		} catch (error) {
			await this.logger.error(`Failed to update contribution of student ${studLogin} on database`);
			throw new InternalServerErrorException(`Failed to find contribution for student ${studLogin} on database (${error})`);
		}
	}

	async update(studLogin: string, contribution: any): Promise<void> {
		let cont = await this.findOne(studLogin)
		if (!cont) {
			await this.logger.error(`Failed to update contribution, student ${studLogin} does not exist or does not have any contribution`);
			throw new NotFoundException(`Failed to update contribution, student ${studLogin} does not exist or does not have any contribution`);
		}
		try {
			await this.contributionRepository.update(cont, contribution);
			this.logger.log(`Successfully updated current contribution of student ${studLogin}`)
		} catch (error) {
			await this.logger.error(`Failed to update contribution of student ${studLogin} on database`);
			throw new UnprocessableEntityException(`Failed to update contribution of student ${studLogin} on database (${error})`);
		}
	}

	async create(contributionData: ContributionDto): Promise<void> {
		try {
			await this.contributionRepository.save(contributionData);

		} catch (error) {

		}
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
			await this.logger.warn(`Failed to delete contributions of student ${studLogin}, no contribution found`);
		}
		try {
			await this.contributionRepository.delete({ studLogin: studLogin });
			this.logger.log(`Successfully deleted all contributions of student ${studLogin}`)
		} catch (error) {
			this.logger.error(`Failed to delete all contributions of student ${studLogin}`)
			throw new UnprocessableEntityException(`Failed to delete contributions of student ${studLogin} on database (${error})`);
		}
	}

	async removeAll(): Promise<void> {
		try {
			await this.contributionRepository.delete({});
			this.logger.log(`Successfully deleted all contributions`)
		} catch (error) {
			this.logger.error(`Failed to delete all contributions`)
			throw new UnprocessableEntityException(`Failed to delete all contributions on database (${error})`);
		}
	}
}
