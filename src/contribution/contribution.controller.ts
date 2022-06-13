import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseFilters } from '@nestjs/common';
import { Contribution } from '../entity/Contribution';
import { ContributionDto } from './contribution.dto';
import { ContributionDtoPipe } from './contribution.pipe';
import { ContributionService } from './contribution.service';

@Controller('contribution')
export class ContributionController {
	constructor(private contributionService: ContributionService) { }

	@Get()
	findAll(): Promise<Contribution[]> {
		return this.contributionService.findAll();
	}

	@Get(':login/last')
	findLast(@Param('login') login: string): Promise<Contribution> {
		return this.contributionService.findLast(login);
	}

	@Get(':login')
	findForUser(@Param('login') login: string): Promise<Contribution[]> {
		return this.contributionService.findForUser(login);
	}

	@Post()
	create(@Body(ContributionDtoPipe) contribution: ContributionDto) {
		return this.contributionService.create(contribution);
	}

	@Patch(':login')
	update(@Param('login') login: string, @Body(ContributionDtoPipe) contribution: any) {
		return this.contributionService.update(login, contribution);
	}

	@Delete(':login')
	remove(@Param('login', ParseIntPipe) login: string) {
		return this.contributionService.removeOne(login);
	}

	@Delete()
	removeAll() {
		return this.contributionService.removeAll();
	}
}
