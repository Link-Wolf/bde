import { Injectable, NotFoundException } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { Repository } from 'typeorm';
import { Counter } from '../entity/Conter';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CounterService {
	constructor(
		@InjectRepository(Counter)
		private counterRepository: Repository<Counter>,
		private logger: LoggerService,
	) { }

	async getVisit(session: Record<string, any>) {
		try {

			const counters = await this.counterRepository.find();
			console.log(counters)
			if (counters.length === 0)
				throw new NotFoundException(`Counter doesn't exists`)
			this.logger.log(
				`Got visit counter`,
				session.login
			)
			return counters;
		} catch (err) {
			this.logger.error(
				`Failed -> Get visit counter on database (${err})`,
				session.login
			)
			throw err
		}
	}

	async incrementVisit(session: Record<string, any>) {
		try {
			if (session.last !== undefined
				&& (new Date(session.last)
					<= new Date(Date.now() + 1000 * 60 * 60)))
				return;
			session.last = Date.now();
			let counters = await this.counterRepository.find();
			if (counters.length === 0)
				counters[0] = { id: session.login === undefined ? "randomConnard" : session.login, count: 0 };
			counters[0] = { id: session.login === undefined ? "randomConnard" : session.login, count: counters[0].count + 1 };
			console.log(`inc ` + counters)
			let counter = await this.counterRepository.save(counters[0])
			this.logger.log(
				`Incremented visit counter`,
				session.login
			)
			return counter;
		} catch (err) {
			this.logger.error(
				`Failed -> Increment visit counter on database (${err})`,
				session.login
			)
			throw err
		}
	}
}
