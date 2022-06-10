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

	async error(message: string) {
		Logger.error(message);
		await this.logRepertory.save({
			date: new Date(Date.now()),
			message: message,
			type: "error"
		})
		this.logfile("error", message)
	}

	async warn(message: string) {
		Logger.warn(message);
		await this.logRepertory.save({
			date: new Date(Date.now()),
			message: message,
			type: "warn"
		})
		this.logfile("warn", message)
	}

	async log(message: string) {
		Logger.log(message);
		await this.logRepertory.save({
			date: new Date(Date.now()),
			message: message,
			type: "log"
		})
		this.logfile("log", message)
	}

	async verbose(message: string) {
		Logger.verbose(message);
		await this.logRepertory.save({
			date: new Date(Date.now()),
			message: message,
			type: "verbose"
		})
		this.logfile("verbose", message)
	}

	async logfile(type: string, message: string) {
		let today = new Date(Date.now())
		let file = "logs/" + today.toLocaleDateString().replace('/', '-').replace('/', '-') + ".log"
		let hours = today.getHours().toLocaleString()
		let minutes = today.getMinutes().toLocaleString()
		let seconds = today.getSeconds().toLocaleString()
		if (today.getHours() < 10)
			hours = '0' + hours
		if (today.getMinutes() < 10)
			minutes = '0' + minutes
		if (today.getSeconds() < 10)
			seconds = '0' + seconds
		let time = hours + ':' + minutes + ':' + seconds
		console.log(today)
		console.log(file)
		console.log(time)
		fs.appendFile(file, time + '[' + type.toUpperCase() + "] : " + message + '\n', (err) => {
		    if (err) throw err;
		    console.log('The logs were updated!');
		});





	}
}
