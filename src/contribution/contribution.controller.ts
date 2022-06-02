import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Contribution } from './contribution.entity';
import { ContributionService } from './contribution.service';

@Controller('contribution')
export class ContributionController {
	constructor(private contributionService: ContributionService) { }

	@Get()
	findAll(): Promise<Contribution[]> {
		return this.contributionService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number): Promise<Contribution> {
		return this.contributionService.findOne(id);
	}

	@Post()
	create(@Body() contribution: Contribution) {
		this.contributionService.create(contribution);
	}

	@Delete(':id')
	remove(@Param('id', ParseIntPipe) id: number) {
		this.contributionService.remove(id);
	}
}
