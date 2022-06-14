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
		private logger: LoggerService,
	) { }

	async findAll(): Promise<Contribution[]> {
		try {
			let contribs = this.contributionRepository.find();
			await this.logger.log(`Got all contributions`);
			return contribs
		} catch (error) {
			await this.logger.error(`Failed to get all contributions on database (${error})`);
			throw new InternalServerErrorException(`Failed to get all contributions on database (${error})`);
		}
	}

	async findLast(studLogin: string): Promise<Contribution> {
		try {
			let cont = await this.contributionRepository.findOne({
				where: { studLogin: studLogin },
				order: { begin_date: "DESC" },
			});

			if (!cont)
				this.logger.warn(`Failed to find contribution for student ${studLogin} : contribution does not exist`)
			else
				this.logger.log(`Got last contribution of student ${studLogin}`)
			return cont
		} catch (error) {
			await this.logger.error(`Failed to update contribution of student ${studLogin} on database (${error})`);
			throw new InternalServerErrorException(`Failed to find contribution for student ${studLogin} on database (${error})`);
		}
	}

	async findForUser(studLogin: string): Promise<Contribution[]> {
		try {
			let cont = await this.contributionRepository.find({
				where: { studLogin: studLogin },
				order: { begin_date: "DESC" },
			});

			if (!cont)
				this.logger.warn(`Failed to find all contributions for student ${studLogin} : student does not have any contribution`)
			else
				this.logger.log(`Got all contributions of student ${studLogin}`)
			return cont
		} catch (error) {
			await this.logger.error(`Failed to get all contributions of student ${studLogin} on database (${error})`);
			throw new InternalServerErrorException(`Failed to get all contributions for student ${studLogin} on database (${error})`);
		}
	}

	async update(studLogin: string, contribution: any): Promise<void> {
		try {
			let cont = await this.findLast(studLogin)
			if (!cont) {
				await this.logger.error(`Failed to update contribution of student ${studLogin} : student does not exist or does not have any contribution`);
				throw new NotFoundException(`Failed to update contribution of student ${studLogin} : student does not exist or does not have any contribution`);
			}
			await this.contributionRepository.update(cont.id, contribution);
			this.logger.log(`Successfully updated current contribution of student ${studLogin}`)
		} catch (error) {
			await this.logger.error(`Failed to update contribution of student ${studLogin} on database (${error})`);
			throw new UnprocessableEntityException(`Failed to update contribution of student ${studLogin} on database (${error})`);
		}
	}

	async create(contributionData: ContributionDto): Promise<void> {
		try {
			await this.contributionRepository.insert(contributionData);
			this.logger.log(`Successfully created contribution for student ${contributionData.stud.login}`)
		}
		catch (error) {
			await this.logger.error(`Failed to create contribution for student ${contributionData.stud.login} on database (${error})`);
			throw new UnprocessableEntityException(`Failed to create contribution for student ${contributionData.stud.login} on database (${error})`);
		}
	}

	async removeOne(studLogin: string): Promise<void> {
		let cont = await this.findLast(studLogin)
		if (!cont) {
			await this.logger.warn(`Failed to delete contributions of student ${studLogin} : contribution does not exist`);
		}
		try {
			await this.contributionRepository.delete({ studLogin: studLogin });
			this.logger.log(`Successfully deleted all contributions of student ${studLogin}`)
		} catch (error) {
			this.logger.error(`Failed to delete all contributions of student ${studLogin} on database (${error})`)
			throw new UnprocessableEntityException(`Failed to delete contributions of student ${studLogin} on database (${error})`);
		}
	}

	async removeAll(): Promise<void> {
		try {
			await this.contributionRepository.delete({});
			this.logger.log(`Successfully deleted all contributions`)
		} catch (error) {
			this.logger.error(`Failed to delete all contributions on database (${error})`)
			throw new UnprocessableEntityException(`Failed to delete all contributions on database (${error})`);
		}
	}
}
