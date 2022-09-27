import { Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contribution } from '../entity/Contribution';
import { LoggerService } from '../logger/logger.service';
import { ContributionDto } from './contribution.dto';

@Injectable()
export class ContributionService {
	constructor(
		@InjectRepository(Contribution)
		private contributionRepository: Repository<Contribution>,
		private logger: LoggerService,
	) { }

	getInfo(login: string) {
		this.logger.log(`Got contribution price`, login)
		return { price: process.env.CONTRIBUTION_PRICE };
	}

	async findAll(requestMaker: string): Promise<Contribution[]> {
		try {
			let contribs = this.contributionRepository.find();
			await this.logger.log(`Got all contributions`, requestMaker);
			return contribs
		} catch (error) {
			await this.logger.error(`Failed to get all contributions on database (${error})`, requestMaker);
			throw new InternalServerErrorException(`Failed to get all contributions on database (${error})`, requestMaker);
		}
	}

	async findLast(studLogin: string, requestMaker: string): Promise<Contribution> {
		try {
			let cont = await this.contributionRepository.findOne({
				where: { studLogin: studLogin },
				order: { begin_date: "DESC" },
			});

			if (!cont)
				this.logger.warn(`Failed to find contribution for student ${studLogin} : contribution does not exist`, requestMaker)
			else
				this.logger.log(`Got last contribution of student ${studLogin}`, requestMaker)
			return cont
		} catch (error) {
			await this.logger.error(`Failed to update contribution of student ${studLogin} on database (${error})`, requestMaker);
			throw new InternalServerErrorException(`Failed to find contribution for student ${studLogin} on database (${error})`);
		}
	}

	async findForUser(studLogin: string, requestMaker: string): Promise<Contribution[]> {
		try {
			let cont = await this.contributionRepository.find({
				where: { studLogin: studLogin },
				order: { begin_date: "DESC" },
			});

			if (!cont)
				this.logger.warn(`Failed to find all contributions for student ${studLogin} : student does not have any contribution`, requestMaker)
			else
				this.logger.log(`Got all contributions of student ${studLogin}`, requestMaker)
			return cont
		} catch (error) {
			await this.logger.error(`Failed to get all contributions of student ${studLogin} on database (${error})`, requestMaker);
			throw new InternalServerErrorException(`Failed to get all contributions for student ${studLogin} on database (${error})`);
		}
	}

	async update(studLogin: string, contribution: any, requestMaker: string): Promise<any> {
		try {
			let cont = await this.findLast(studLogin, requestMaker)
			if (!cont) {
				await this.logger.error(`Failed to update contribution of student ${studLogin} : student does not exist or does not have any contribution`, requestMaker);
				throw new NotFoundException(`Failed to update contribution of student ${studLogin} : student does not exist or does not have any contribution`);
			}
			let ret = await this.contributionRepository.update(cont.id, contribution);
			this.logger.warn(`Successfully updated current contribution of student ${studLogin}`, requestMaker)
			return ret
		} catch (error) {
			await this.logger.error(`Failed to update contribution of student ${studLogin} on database (${error})`, requestMaker);
			throw new UnprocessableEntityException(`Failed to update contribution of student ${studLogin} on database (${error})`);
		}
	}

	async create(contributionData: ContributionDto, requestMaker: string): Promise<any> {
		try {
			let ret = await this.contributionRepository.insert(contributionData);
			this.logger.log(`Successfully created contribution for student ${contributionData.stud.login}`, requestMaker)
			return ret
		}
		catch (error) {
			await this.logger.error(`Failed to create contribution for student on database (${error})`, requestMaker);
			throw new UnprocessableEntityException(`Failed to create contribution for student on database (${error})`);
		}
	}

	async forceCreate(contributionData: ContributionDto, requestMaker: string): Promise<any> {
		try {
			let ret = await this.contributionRepository.insert(contributionData);
			this.logger.warn(`Successfully force-created contribution for student ${contributionData.stud.login}`, requestMaker)
			return ret
		}
		catch (error) {
			await this.logger.error(`Failed to force-create contribution for student on database (${error})`, requestMaker);
			throw new UnprocessableEntityException(`Failed to force-create contribution for student on database (${error})`);
		}
	}

	async removeOne(studLogin: string, requestMaker: string): Promise<any> {
		let cont = await this.findLast(studLogin, requestMaker)
		if (!cont) {
			await this.logger.warn(`Failed to delete contributions of student ${studLogin} : contribution does not exist`, requestMaker);
		}
		try {
			let ret = await this.contributionRepository.delete({ studLogin: studLogin });
			this.logger.log(`Successfully deleted all contributions of student ${studLogin}`, requestMaker)
			return ret
		} catch (error) {
			this.logger.error(`Failed to delete all contributions of student ${studLogin} on database (${error})`, requestMaker)
			throw new UnprocessableEntityException(`Failed to delete contributions of student ${studLogin} on database (${error})`);
		}
	}

	async removeAll(requestMaker: string): Promise<any> {
		try {
			let ret = await this.contributionRepository.delete({});
			this.logger.log(`Successfully deleted all contributions`, requestMaker)
			return ret
		} catch (error) {
			this.logger.error(`Failed to delete all contributions on database (${error})`, requestMaker)
			throw new UnprocessableEntityException(`Failed to delete all contributions on database (${error})`);
		}
	}
}
