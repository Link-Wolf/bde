import { Controller, Get, Session, Post } from '@nestjs/common';
import { CounterService } from './counter.service';

@Controller('counter')
export class CounterController {
	constructor(private counterService: CounterService) { }

	@Get()
	async getVisit(@Session() session: Record<string, any>) {
		return this.counterService.getVisit(session)
	}

	@Post()
	async countVisit(@Session() session: Record<string, any>) {
		return this.counterService.incrementVisit(session)
	}
}
