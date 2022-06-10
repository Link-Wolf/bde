import { ConsoleLogger, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from '../entity/Log';
import * as fs from 'fs';

@Injectable()
export class LoggerService {
	constructor(
		@InjectRepository(Log)
		private logRepertory: Repository<Log>
	) { }

	error(message: string) {
		Logger.error(message);
		this.logRepertory.save({
			date: new Date(Date.now()),
			message: message,
			type: "error"
		})
		this.logfile("error", message)


		// append file
	}

	warn(message: string) {
		Logger.warn(message);
		this.logRepertory.save({
			date: new Date(Date.now()),
			message: message,
			type: "warn"
		})
		this.logfile("warn", message)

		// append file
	}

	log(message: string) {
		Logger.log(message);
		this.logRepertory.save({
			date: new Date(Date.now()),
			message: message,
			type: "log"
		})
		this.logfile("log", message)

		// append file
	}

	verbose(message: string) {
		Logger.verbose(message);
		this.logRepertory.save({
			date: new Date(Date.now()),
			message: message,
			type: "verbose"
		})
		this.logfile("verbose", message)
		// append file
	}

	logfile(type: string, message: string) {
		let file = (new Date(Date.now())).toLocaleDateString() + ".log"
		console.log(file)
		fs.appendFile(file, '\n' + '[' + type.toUpperCase() + "] : " + message, (err) => {
		    if (err) throw err;
		    console.log('The logs were updated!');
		});





	}
}
