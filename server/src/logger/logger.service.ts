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

	async error(message: string, requestMaker: string, isAdmin = false) {
		Logger.error(`${requestMaker === undefined ? "unknown public" : requestMaker} : ${message}`);
		await this.logRepertory.save({
			date: new Date(Date.now()),
			login: `${requestMaker}`,
			message: `${message}`,
			isAdmin: isAdmin,
			type: "error"
		})
		if (requestMaker == undefined)
			this.logfile("error", `(unknown public) : ${message}`)
		else
			this.logfile("error", `(${requestMaker}) : ${message}`)
	}

	async warn(message: string, requestMaker: string, isAdmin = false) {
		Logger.warn(`${requestMaker === undefined ? "unknown public" : requestMaker} : ${message}`);
		const t = {
			date: new Date(Date.now()),
			login: `${requestMaker}`,
			message: `${message}`,
			isAdmin: isAdmin,
			type: "warn"
		}
		await this.logRepertory.save(t)
		if (requestMaker == undefined)
			this.logfile("warning", `(unknown public) : ${message}`)
		else
			this.logfile("warning", `(${requestMaker}) : ${message}`)
	}

	async log(message: string, requestMaker: string, isAdmin = false) {
		Logger.log(`${requestMaker === undefined ? "unknown public" : requestMaker} : ${message}`);
		if (requestMaker == undefined)
			this.logfile("log", `(unknown public) : ${message}`)
		else
			this.logfile("log", `(${requestMaker}) : ${message}`)
	}

	async verbose(message: string, requestMaker: string, isAdmin = false) {
		Logger.verbose(`${requestMaker === undefined ? "unknown public" : requestMaker} : ${message}`);
		if (requestMaker == undefined)
			this.logfile("verbose", `(unknown public) : ${message}`)
		else
			this.logfile("verbose", `(${requestMaker}) : ${message}`)
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
		fs.appendFile(file, time + style + ' '.repeat(8 - type.length) + ' > ' + message + '\n', (err) => {
			if (err) throw err;
		});
	}
}
