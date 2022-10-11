import { Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contribution } from '../entity/Contribution';
import { LoggerService } from '../logger/logger.service';
import { ContributionDto } from './contribution.dto';
const { contributionTime, contributionPrice } = require('../../config.json')

@Injectable()
export class ContributionService {
	constructor(
		@InjectRepository(Contribution)
		private contributionRepository: Repository<Contribution>,
		private logger: LoggerService,
	) { }

	getInfo() {
		return { price: contributionPrice, time: contributionTime };
	}

	async findAll(requestMaker: string): Promise<Contribution[]> {
		try {
			let contribs = this.contributionRepository.find();
			await this.logger.log(`Got all contributions`, requestMaker);
			return contribs
		} catch (error) {
			await this.logger.error(`Failed -> Get all contributions on database (${error})`, requestMaker);
			throw error
		}
	}

	async findLast(studLogin: string, requestMaker: string): Promise<Contribution> {
		try {
			let cont = await this.contributionRepository.findOne({
				where: { studLogin: studLogin },
				order: { begin_date: "DESC" },
			});
			if (!cont) {
				this.logger.warn(`Failed -> Find last contribution for student ${studLogin} : student ${studLogin} does not have any contribution`, requestMaker)
				throw new NotFoundException(`Failed to find last contribution for student ${studLogin} : student ${studLogin} does not have any contribution`)
			}
			else
				this.logger.log(`Got last contribution of student ${studLogin}`, requestMaker)
			return cont
		} catch (error) {
			await this.logger.error(`Failed -> Find last contribution of student ${studLogin} on database (${error})`, requestMaker);
			throw error
		}
	}

	async findForUser(studLogin: string, requestMaker: string): Promise<Contribution[]> {
		try {
			let cont = await this.contributionRepository.find({
				where: { studLogin: studLogin },
				order: { begin_date: "DESC" },
			});
			if (!cont) {
				this.logger.warn(`Failed -> Find all contributions for student ${studLogin} : student does not have any contribution`, requestMaker)
				throw new NotFoundException(`Failed to find all contribution for student ${studLogin} : student ${studLogin} does not have any contribution`)
			}
			else
				this.logger.log(`Got all contributions of student ${studLogin}`, requestMaker)
			return cont
		} catch (error) {
			await this.logger.error(`Failed -> Find all contributions of student ${studLogin} on database (${error})`, requestMaker);
			throw error
		}
	}

	async findForUserPremium(studLogin: string, requestMaker: string): Promise<Contribution[]> {
		try {
			let cont = await this.contributionRepository.find({
				where: { studLogin: studLogin },
				order: { begin_date: "DESC" },
			});
			if (!cont) {
				this.logger.warn(`Failed -> Find all contributions for student ${studLogin} : student does not have any contribution`, requestMaker)
				throw new NotFoundException(`Failed to find all contribution for student ${studLogin} : student ${studLogin} does not have any contribution`)
			}
			else
				this.logger.log(`Got all contributions of student ${studLogin}`, requestMaker)
			return cont
		} catch (error) {
			await this.logger.error(`Failed -> Find all contributions of student ${studLogin} on database (${error})`, requestMaker);
			throw error
		}
	}

	async update(studLogin: string, contribution: any, requestMaker: string): Promise<any> {
		try {
			let cont = await this.findLast(studLogin, requestMaker)
			let ret = await this.contributionRepository.update(cont.id, contribution);
			this.logger.warn(`Updated current contribution of student ${studLogin}`, requestMaker, true)
			return ret
		} catch (error) {
			await this.logger.error(`Failed -> Update contribution of student ${studLogin} on database (${error})`, requestMaker, true);
			throw error
		}
	}

	async create(contributionData: ContributionDto, requestMaker: string): Promise<any> {
		try {
			let ret = await this.contributionRepository.insert(contributionData);
			this.logger.log(`Created contribution for student ${contributionData.stud.login}`, requestMaker)
			return ret
		}
		catch (error) {
			await this.logger.error(`Failed -> Create contribution for student ${contributionData.stud.login} on database (${error})`, requestMaker);
			throw error
		}
	}

	async forceCreate(contributionData: ContributionDto, requestMaker: string): Promise<any> {
		try {
			let ret = await this.contributionRepository.insert(contributionData);
			this.logger.warn(`Force created contribution for student ${contributionData.stud.login}`, requestMaker, true)
			return ret
		}
		catch (error) {
			await this.logger.error(`Failed -> Force create contribution for student ${contributionData.stud.login} on database (${error})`, requestMaker, true);
			throw error
		}
	}

	async removeOne(studLogin: string, requestMaker: string): Promise<any> {
		let cont = await this.findLast(studLogin, requestMaker)
		if (!cont) {
			await this.logger.warn(`Failed -> Delete last contribution of student ${studLogin} : student ${studLogin} does not have any contribution`, requestMaker, true);
		}
		try {
			let ret = await this.contributionRepository.delete({ studLogin: studLogin });
			this.logger.log(`Deleted last contribution of student ${studLogin}`, requestMaker, true)
			return ret
		} catch (error) {
			this.logger.error(`Failed -> Delete last contribution of student ${studLogin} on database (${error})`, requestMaker, true)
			throw error
		}
	}

	async removeAll(requestMaker: string): Promise<any> {
		try {
			let ret = await this.contributionRepository.delete({});
			this.logger.log(`Deleted all contributions`, requestMaker, true)
			return ret
		} catch (error) {
			this.logger.error(`Failed -> Delete all contributions on database (${error})`, requestMaker, true)
			throw error
		}
	}
}
