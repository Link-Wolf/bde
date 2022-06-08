import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { Contribution } from '../entity/Contribution';
import { ContributionDto, ContributionUpdateDto } from './contribution.dto';
import { ContributionDtoPipe, ContributionUpdateDtoPipe } from './contribution.pipe';
import { ContributionService } from './contribution.service';

@Controller('contribution')
export class ContributionController {
	constructor(private contributionService: ContributionService) { }

	@Get()
	findAll(): Promise<Contribution[]> {
		return this.contributionService.findAll();
	}

	@Get(':login')
	async findOne(@Param('login') login: string): Promise<Contribution> {
		console.log(await this.contributionService.findOne(login));
		return this.contributionService.findOne(login);
	}

	@Post()
	create(@Body(ContributionDtoPipe) contribution: ContributionDto) {
		this.contributionService.create(contribution);
	}

	@Patch(':login')
	update(@Param('login') login: string, @Body(ContributionUpdateDtoPipe) contribution: ContributionUpdateDto) {
		this.contributionService.update(login, contribution);
	}

	@Delete(':login')
	remove(@Param('login', ParseIntPipe) login: string) {
		this.contributionService.removeOne(login);
	}

	@Delete()
	removeAll() {
		this.contributionService.removeAll();
	}
}
