import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThanOrEqual, Repository } from 'typeorm';
import { Logs } from '../entity/Logs'
import { Stud } from '../entity/Stud';
import { LoggerService } from '../logger/logger.service';
import { StudService } from '../stud/stud.service';
import { LogsDto, LogsFilterDto } from './logs.dto';

@Injectable()
export class LogsService {

	constructor(
		@InjectRepository(Logs)
		private logsRepository: Repository<Logs>,
		private logger: LoggerService,
	) { }

	async findAll(filterDto: LogsFilterDto, requestMaker: string): Promise<Logs[]> {
		try {
			let match = `SELECT * FROM "logs" WHERE '1' = '1'`;
			if (filterDto.warn) {
				if (filterDto.error)
					match += ` AND ("type" = 'warn' OR "type" = 'error')`
				else
					match += ` AND "type" = 'warn'`
			}
			else if (filterDto.error)
				match += ` AND "type" = 'error'`
			else
				match += ` AND "type" != 'error' AND "type" != 'warn'`
			if (filterDto.login && filterDto.login != "")
				match += ` AND "login" = '${filterDto.login}'`
			if (filterDto.isAdmin)
				match += ` AND "isAdmin" = 't'`
			match += ` ORDER BY "date" ${
				filterDto.asc ? "ASC"
					: "DESC"
				} `
			match += `; `
			let logs = await this.logsRepository.query(match);
			this.logger.log(`Got all filtered logs`, requestMaker, true);
			return logs;
		} catch (error) {
			this.logger.error(`Failed -> Get all filtered logs on database(${error})`, requestMaker, true);
			throw error
		}
	}
}
