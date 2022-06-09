import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Log } from "../entity/Log";

@Injectable()
export class LogService {
	constructor(
		@InjectRepository(Log)
		private logRepository: Repository<Log>,
	) {
	}

	async create(message: string, type: string) {
		await this.logRepository.save({ message: message, type: type })
	}
}
