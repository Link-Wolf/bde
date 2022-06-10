import { Injectable, Logger } from '@nestjs/common';
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
		// append file
	}

	warning(message: string) {
		Logger.warn(message);
		this.logRepertory.save({
			bla
		})
		// append file
	}

	log(message: string) {
		Logger.log(message);
		this.logRepertory.save({
			bla
		})
		// append file
	}

	verbose(message: string) {
		Logger.verbose(message);
		this.logRepertory.save({
			bla
		})
		// append file
	}
}
