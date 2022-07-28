import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, Session } from '@nestjs/common';
import { Contribution } from '../entity/Contribution';
import { ContributionDto } from './contribution.dto';
import { ContributionDtoPipe } from './contribution.pipe';
import { ContributionService } from './contribution.service';

@Controller('contribution')
export class ContributionController {
	constructor(private contributionService: ContributionService) { }

	@Get()
	findAll(@Session() session: Record<string, any>): Promise<Contribution[]> {
		return this.contributionService.findAll(session.login);
	}

	@Get(':login/last')
	findLast(@Session() session: Record<string, any>, @Param('login') login: string): Promise<Contribution> {
		return this.contributionService.findLast(login, session.login);
	}

	@Get(':login')
	findForUser(@Session() session: Record<string, any>, @Param('login') login: string): Promise<Contribution[]> {
		return this.contributionService.findForUser(login, session.login);
	}

	@Post('admin')
	forceCreate(@Session() session: Record<string, any>, @Body(ContributionDtoPipe) contribution: ContributionDto) {
		return this.contributionService.create(contribution, session.login);
	}

	@Post()
	create(@Session() session: Record<string, any>, @Body(ContributionDtoPipe) contribution: ContributionDto) {
		return this.contributionService.create(contribution, session.login);
	}

	@Patch('admin/:login')
	update(@Session() session: Record<string, any>, @Param('login') login: string, @Body(ContributionDtoPipe) contribution: any) {
		return this.contributionService.update(login, contribution, session.login);
	}

	@Delete(':login')
	remove(@Session() session: Record<string, any>, @Param('login', ParseIntPipe) login: string) {
		return this.contributionService.removeOne(login, session.login);
	}

	@Delete()
	removeAll(@Session() session: Record<string, any>) {
		return this.contributionService.removeAll(session.login);
	}
}
