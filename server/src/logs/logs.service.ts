import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logs } from '../entity/Logs'
import { LoggerService } from '../logger/logger.service';
import { LogsFilterDto } from './logs.dto';
import JSZip = require('jszip');
import * as fs from 'fs';

@Injectable()
export class LogsService {
	constructor(
		@InjectRepository(Logs)
		private logsRepository: Repository<Logs>,
		private logger: LoggerService,
	) { }

	async blobAll(login: string) {
		try {
			const addFilesFromDirectoryToZip =
				(directoryPath: fs.PathLike, zip: JSZip) => {
					const directoryContents = fs.readdirSync(directoryPath, {
						withFileTypes: true,
					});

					console.log(directoryPath, directoryContents)

					directoryContents.forEach(({ name }) => {
						const path = `${directoryPath}/${name}`;

						if (fs.statSync(path).isFile()) {
							zip.file(`${name}`, fs.readFileSync(path));
						}

						if (fs.statSync(path).isDirectory()) {
							addFilesFromDirectoryToZip(path, zip);
						}
					});
				};

			const directoryPath = 'logs'
			const zip = new JSZip();

			addFilesFromDirectoryToZip(directoryPath, zip);
			const zipAsBase64 = await zip.generateAsync({ type: "base64" });
			this.logger.log(`Blobed all logs`, login, true);

			return zipAsBase64;
		}
		catch (err) {
			this.logger.error(`Failed -> Blob all logs`, login, true)
			throw err;
		}
	}

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
