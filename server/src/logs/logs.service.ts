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
			if (filterDto.login && filterDto.login != "")
				match += ` AND "login" = '${filterDto.login}'`
			match += ` ORDER BY "date" ${
				filterDto.asc ? "ASC"
					: "DESC"
				} `
			match += `; `
			let logs = await this.logsRepository.query(match);
			// if (events.length == 0)			// 	this.logger.warn(`No events found`)
			// else
			this.logger.log(`Got all filtered logs`, requestMaker);
			return logs;
		} catch (error) {
			this.logger.error(`Failed to get all filtered logs on database(${error})`, requestMaker);
			throw new InternalServerErrorException(`Could not find filtered logs on database(${error})`)
		}
	}

	// async findCurrent(): Promise<Logs[]> {
	// 	try {
	// 		let logss = await this.logsRepository.findBy({
	// 			end_date: IsNull() || MoreThanOrEqual(new Date(Date.now()))
	// 		});
	// 		// if (logss.length == 0)
	// 		// 	this.logger.warn(`No current logss found`)
	// 		// else
	// 		this.logger.log(`Got all current logss`);
	// 		return logss;
	// 	} catch (error) {
	// 		this.logger.error(`Failed to get all current logss on database(${error})`);
	// 		throw new InternalServerErrorException(`Failed to get all current logss on database(${error})`)
	// 	}
	// }
	//
	// async findOne(id: number): Promise<Logs> {
	// 	try {
	// 		let logs = await this.logsRepository.findOneBy({ id: id });
	// 		if (logs)
	// 			// 	this.logger.warn(`Failed to find logs with id ${ id } : logs does not exist`)
	// 			// else
	// 			this.logger.log(`Got logs with id ${id} `);
	// 		return logs;
	// 	} catch (error) {
	// 		this.logger.error(`Failed to find logs ${id} on database(${error})`);
	// 		throw new InternalServerErrorException(`Failed to find logs ${id} on database(${error})`)
	// 	}
	// }
	//
	// async update(id: number, logsData: LogsDto): Promise<void> {
	// 	// if no logs id (find) -> err NotFoundException
	// 	try {
	// 		if (!await this.findOne(id)) {
	// 			this.logger.error(`Failed to update logs with id ${id} : logs does not exist`);
	// 			throw new NotFoundException(`Failed to update logs with id ${id} : logs does not exist`);
	// 		}
	// 		await this.logsRepository.update(id, logsData);
	// 		this.logger.log(`Successfully updated logs ${id} `);
	// 	} catch (error) {
	// 		this.logger.error(`Failed to update logs ${id} on database(${error})`)
	// 		throw new InternalServerErrorException(`Failed to update logs ${id} on database(${error})`)
	// 	}
	// }
	//
	// async subscribe(id: number, login: string): Promise<void> {
	// 	try {
	// 		let logs = await this.findOne(id);
	// 		if (!logs) {
	// 			this.logger.error(`Failed to subscribe student ${login} to logs ${id} : logs does not exist`)
	// 			throw new NotFoundException(`Failed to subscribe student ${login} to logs ${id} : logs does not exist`)
	// 		}
	// 		logs.studs = await this.getStuds(id);
	// 		let stud = await this.studService.findOne(login);
	// 		if (!stud) {
	// 			this.logger.error(`Failed to subscribe student ${login} to logs ${id} : student does not exist`)
	// 			throw new NotFoundException(`Failed to subscribe student ${login} to logs ${id} : student does not exist`)
	// 		}
	// 		logs.studs.push(stud);
	// 		await this.logsRepository.save(logs);
	// 		this.logger.log(`Successfully subscribe student ${login} to logs ${id} `);
	// 	} catch (error) {
	// 		this.logger.error(`Failed to subscribe student ${login} to logs ${id} on database(${error})`)
	// 		throw new InternalServerErrorException(`Failed to subscribe student ${login} to logs ${id} on database(${error})`)
	// 	}
	// }
	//
	// async forceSubscribe(id: number, login: string): Promise<void> {
	// 	try {
	// 		let logs = await this.findOne(id);
	// 		if (!logs) {
	// 			this.logger.error(`Failed to force subscribe student ${login} to logs ${id} : logs does not exist`)
	// 			throw new NotFoundException(`Failed to force subscribe student ${login} to logs ${id} : logs does not exist`)
	// 		}
	// 		logs.studs = await this.getStuds(id);
	// 		let stud = await this.studService.findOne(login);
	// 		if (!stud) {
	// 			// this.logger.error(`Failed to force subscribe student ${login} to logs ${id} : student does not exist`)
	// 			throw new NotFoundException(`Failed to force subscribe student ${login} to logs ${id} : student does not exist`)
	// 		}
	// 		logs.studs.push(stud);
	// 		await this.logsRepository.save(logs);
	// 		this.logger.warn(`Successfully force subscribe student ${login} to logs ${id} `);
	// 	} catch (error) {
	// 		// this.logger.error(`Failed to force subscribe student ${login} to logs ${id} on database(${error})`)
	// 		// throw new InternalServerErrorException(`Failed to force subscribe student ${login} to logs ${id} on database(${error})`)
	// 		throw error;
	// 	}
	// }
	//
	// async create(logsDto: LogsDto): Promise<void> {
	// 	try {
	// 		await this.logsRepository.save(logsDto);
	// 		this.logger.log(`Successfully created new logs ${logsDto.name} `);
	// 	} catch (error) {
	// 		this.logger.error(`Failed to create logs ${logsDto.name} on database(${error})`)
	// 		throw new InternalServerErrorException(`Failed to create logs ${logsDto.name} on database(${error})`)
	// 	}
	// }
	//
	// async removeOne(id: number): Promise<void> {
	// 	try {
	// 		if (await this.findOne(id)) {
	// 			await this.logsRepository.delete({ id: id });
	// 			this.logger.log(`Successfully deleted logs ${id} `);
	// 		}
	// 		else
	// 			this.logger.warn(`Failed to delete logs ${id} : logs does no exist`);
	// 	} catch (error) {
	// 		this.logger.error(`Failed to delete logs ${id} on database(${error})`)
	// 		throw new InternalServerErrorException(`Failed to delete logs ${id} on database(${error})`)
	// 	}
	// }
	//
	// async removeAll(): Promise<void> {
	// 	try {
	// 		await this.logsRepository.delete({});
	// 		this.logger.log(`Successfully deleted all logss`);
	// 	} catch (error) {
	// 		this.logger.error(`Failed to delete all logss on database(${error})`)
	// 		throw new InternalServerErrorException(`Failed to delete all logss on database(${error})`)
	// 	}
	// }
	//
	// async getStuds(id: number): Promise<Stud[]> {
	// 	return this.logsRepository.query("SELECT * FROM stud s WHERE s.login IN (SELECT \"studLogin\" FROM inscriptions insc WHERE \"logsId\" = '" + id + "' );");
	// }
}
