import { ConsoleLogger, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from '../entity/Log';

@Injectable()
export class LoggerService {
	constructor(
		@InjectRepository(Log)
		private logRepertory: Repository<Log>
	) { }

	error(message: string) {
		Logger.error(message);
		this.logRepertory.save({
			bla
		})
		this.logfile("error", message)


		// append file
	}

	warn(message: string) {
		Logger.warn(message);
		this.logRepertory.save({
			bla
		})
		this.logfile("warn", message)

		// append file
	}

	log(message: string) {
		Logger.log(message);
		this.logRepertory.save({
			bla
		})
		this.logfile("log", message)

		// append file
	}

	verbose(message: string) {
		Logger.verbose(message);
		this.logRepertory.save({
			bla
		})
		this.logfile("verbose", message)
		// append file
	}

	logfile(type: string, message: string) {
		
	}
}
