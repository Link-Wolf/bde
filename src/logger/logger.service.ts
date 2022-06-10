import { Injectable, Logger } from '@nestjs/common';
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
		this.logfile("warning", message)
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
		const today = new Date(Date.now())
		let day = today.getDay().toLocaleString()
		let month = today.getMonth().toLocaleString()
		let year = today.getFullYear().toLocaleString()
		if (today.getDay() < 10)
			day = '0' + day
		if (today.getMonth() < 10)
			month = '0' + month
		if (today.getFullYear() < 10)
			year = '0' + year
		let file = "logs/" + month + '-' + day + '-' + year + ".log"
		let hours = today.getHours().toLocaleString()
		let minutes = today.getMinutes().toLocaleString()
		let seconds = today.getSeconds().toLocaleString()
		if (today.getHours() < 10)
			hours = '0' + hours
		if (today.getMinutes() < 10)
			minutes = '0' + minutes
		if (today.getSeconds() < 10)
			seconds = '0' + seconds
		const time = hours + ':' + minutes + ':' + seconds
		const style = ' [' + type.toUpperCase() + ']'
		fs.appendFile(file, time + style + ' '.repeat(8 - type.length) +  ' : ' + message + '\n', (err) => {
		    if (err) throw err;
		});
	}
}
