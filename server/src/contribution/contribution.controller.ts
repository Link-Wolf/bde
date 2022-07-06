import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req } from '@nestjs/common';
import { Contribution } from '../entity/Contribution';
import { ContributionDto } from './contribution.dto';
import { ContributionDtoPipe } from './contribution.pipe';
import { ContributionService } from './contribution.service';

@Controller('contribution')
export class ContributionController {
	constructor(private contributionService: ContributionService) { }

	@Get()
	findAll(@Req() req: any): Promise<Contribution[]> {
		return this.contributionService.findAll(req.user.login);
	}

	@Get(':login/last')
	findLast(@Req() req: any, @Param('login') login: string): Promise<Contribution> {
		return this.contributionService.findLast(login, req.user.login);
	}

	@Get(':login')
	findForUser(@Req() req: any, @Param('login') login: string): Promise<Contribution[]> {
		return this.contributionService.findForUser(login, req.user.login);
	}

	@Post()
	create(@Req() req: any, @Body(ContributionDtoPipe) contribution: ContributionDto) {
		return this.contributionService.create(contribution, req.user.login);
	}

	@Patch(':login')
	update(@Req() req: any, @Param('login') login: string, @Body(ContributionDtoPipe) contribution: any) {
		return this.contributionService.update(login, contribution, req.user.login);
	}

	@Delete(':login')
	remove(@Req() req: any, @Param('login', ParseIntPipe) login: string) {
		return this.contributionService.removeOne(login, req.user.login);
	}

	@Delete()
	removeAll(@Req() req: any) {
		return this.contributionService.removeAll(req.user.login);
	}
}
