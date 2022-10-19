import { ArgumentMetadata, NotFoundException } from "@nestjs/common";
import { Injectable, PipeTransform } from "@nestjs/common";
import { LoggerService } from "../logger/logger.service";
import { StudService } from "../stud/stud.service";
import { ClubDto } from "./club.dto";

@Injectable()
export class ClubDtoPipe implements PipeTransform {
	constructor(
		private logger: LoggerService,
		private studService: StudService
	) { console.log("hey") }
	async transform(value: any, _metadata: ArgumentMetadata) {
		let ret = value;
		console.log("ret", ret)
		if ("cost" in value)
			ret.cost = Number(value.cost)
		if ("login" in value) {
			ret.contact = await this.studService.findOne(value.login, "INTERNAL")
			if (!ret.contact) {
				await this.logger.error(`Failed to create or update club, student ${value.login} does not exist`, "INTERNAL");
				throw new NotFoundException(`Failed to create or update club, student ${value.login} does not exist`);
			}
		}
		return ret;
	}
}
