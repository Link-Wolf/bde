import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logs } from '../entity/Logs';
import * as fs from 'fs';

@Injectable()
export class LoggerService {
	constructor(
		@InjectRepository(Logs)
		private logRepertory: Repository<Logs>
	) { }

	async error(message: string, requestMaker: string) {
		Logger.error(`${requestMaker} : ${message}`);
		await this.logRepertory.save({
			date: new Date(Date.now()),
			message: `${requestMaker} : ${message}`,
			type: "error"
		})
		this.logfile("error", `${requestMaker} : ${message}`)
	}

	async warn(message: string, requestMaker: string) {
		Logger.warn(`${requestMaker} : ${message}`);
		await this.logRepertory.save({
			date: new Date(Date.now()),
			message: `${requestMaker} : ${message}`,
			type: "warn"
		})
		this.logfile("warning", `${requestMaker} : ${message}`)
	}

	async log(message: string, requestMaker: string) {
		Logger.log(`${requestMaker} : ${message}`);
		// await this.logRepertory.save({
		// 	date: new Date(Date.now()),
		// 	message: message,
		// 	type: "log"
		// })
		this.logfile("log", `${requestMaker} : ${message}`)
	}

	async verbose(message: string, requestMaker: string) {
		Logger.verbose(`${requestMaker} : ${message}`);
		// await this.logRepertory.save({
		// 	date: new Date(Date.now()),
		// 	message: message,
		// 	type: "verbose"
		// })
		this.logfile("verbose", `${requestMaker} : ${message}`)
	}

	async logfile(type: string, message: string) {
		const today = new Date(Date.now())
		let day = today.getDate().toLocaleString()
		let month = (today.getMonth() + 1).toLocaleString()
		let year = today.getFullYear().toString()
		if (today.getDate() < 10)
			day = '0' + day
		if (today.getMonth() + 1 < 10)
			month = '0' + month
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
		fs.appendFile(file, time + style + ' '.repeat(8 - type.length) + ' : ' + message + '\n', (err) => {
			if (err) throw err;
		});
	}
}
