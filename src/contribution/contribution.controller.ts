import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Contribution } from '../entity/Contribution';
import { ContributionDto } from './contribution.dto';
import { ContributionService } from './contribution.service';

@Controller('contribution')
export class ContributionController {
	constructor(private contributionService: ContributionService) { }

	@Get()
	findAll(): Promise<Contribution[]> {
		return this.contributionService.findAll();
	}

	@Get(':login')
	findOne(@Param('login', ParseIntPipe) login: string): Promise<Contribution> {
		return this.contributionService.findOne(login);
	}

	@Post()
	create(@Body() contribution: ContributionDto) {
		this.contributionService.create(contribution);
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
