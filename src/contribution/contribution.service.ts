import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contribution } from '../entity/Contribution';
import { UserService } from '../user/user.service';
import { ContributionDto, ContributionUpdateDto } from './contribution.dto';

@Injectable()
export class ContributionService {
	constructor(
		@InjectRepository(Contribution)
		private contributionRepository: Repository<Contribution>,
		private userService: UserService
	) { }

	findAll(): Promise<Contribution[]> {
		return this.contributionRepository.find();
	}

	findOne(userLogin: string): Promise<Contribution> {
		return this.contributionRepository.findOne({
			where: { userLogin: userLogin },
			order: { begin_date: "DESC"},
		});
	}

	async update(userLogin: string, contribution: ContributionUpdateDto): Promise<void> {
		let cont = await this.contributionRepository.findOne({
			where: { userLogin: userLogin },
			order: { begin_date: "DESC"},
		});
		let begin = new Date(cont.begin_date);
		let end = new Date(cont.end_date);
		if("begin_date" in contribution)
		{
			let cont_begin = new Date(contribution.begin_date);
			begin.setFullYear(
				cont_begin.getFullYear(),
				cont_begin.getMonth(),
				cont_begin.getDate())
		}
		if ("end_date" in contribution)
		{
			let cont_end = new Date(contribution.end_date);
			end.setFullYear(
				cont_end.getFullYear(),
				cont_end.getMonth(),
				cont_end.getDate())
		}
		await this.contributionRepository.update(cont, {
			begin_date: begin || cont.begin_date,
			cost: "cost" in contribution ? Number(contribution.cost) : cont.cost,
			end_date: end || cont.end_date,
			user: await this.userService
				.findOne(contribution.user) || cont.user
		});
	}

	async create(contribution: ContributionDto): Promise<void> {
		let today = new Date(Date.now());
		let due = new Date(Date.now());
		due.setMonth(due.getMonth() + 6)
		await this.contributionRepository.save({
			begin_date: today,
			cost: 10,
			end_date: due,
			user: await this.userService
				.findOne(contribution.user)
		});
	}

	async removeOne(userLogin: string): Promise<void> {
		await this.contributionRepository.delete({ userLogin: userLogin });
	}

	async removeAll(): Promise<void> {
		await this.contributionRepository.delete({});
	}
}
