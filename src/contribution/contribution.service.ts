import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contribution } from '../entity/Contribution';
import { StudService } from '../stud/stud.service';
import { ContributionDto, ContributionUpdateDto } from './contribution.dto';

@Injectable()
export class ContributionService {
	constructor(
		@InjectRepository(Contribution)
		private contributionRepository: Repository<Contribution>,
		private studService: StudService
	) { }

	async findAll(): Promise<Contribution[]> {
		let conts = this.contributionRepository.find();
		console.log(await conts)
		return conts;
	}

	async findOne(studLogin: string): Promise<Contribution> {
		let cont = this.contributionRepository.findOne({
			where: { login: studLogin },
			order: { begin_date: "DESC" },
		});
		console.log(await cont);
		return cont;
	}

	async update(studLogin: string, contribution: ContributionUpdateDto): Promise<void> {
		await this.contributionRepository.update(studLogin, contribution);
	}

	async create(contributionData: any): Promise<void> {
		console.log(await this.contributionRepository.save(contributionData));
	}

	async removeOne(studLogin: string): Promise<void> {
		console.log(await this.contributionRepository.delete({ login: studLogin }));
	}

	async removeAll(): Promise<void> {
		console.log(await this.contributionRepository.delete({}));
	}
}
