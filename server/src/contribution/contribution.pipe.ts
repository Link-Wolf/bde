import { ArgumentMetadata, NotFoundException } from "@nestjs/common";
import { Injectable, PipeTransform } from "@nestjs/common";
import { LoggerService } from "../logger/logger.service";
import { StudService } from "../stud/stud.service";
import { ContributionDto } from "./contribution.dto";

@Injectable()
export class ContributionDtoPipe implements PipeTransform {
	constructor(
		private logger: LoggerService,
		private studService: StudService
	) { }
	async transform(value: any, _metadata: ArgumentMetadata) {
		let ret = new ContributionDto();
		if ("cost" in value)
			ret.cost = Number(value.cost)
		if ("studLogin" in value) {
			ret.stud = await this.studService.findOne(value.studLogin, "INTERNAL")
			if (!ret.stud) {
				await this.logger.error(`Failed to create or update contribution, student ${value.studLogin} does not exist`, "INTERNAL");
				throw new NotFoundException(`Failed to create or update contribution, student ${value.studLogin} does not exist`);
			}
		}
		if ("begin_date" in value)
			ret.begin_date = new Date(value.begin_date)
		else
			ret.begin_date = new Date(Date.now())
		if ("end_date" in value)
			ret.end_date = new Date(value.end_date)
		else {
			ret.end_date = new Date(Date.now())
			ret.end_date.setMonth(ret.begin_date.getMonth() + 6)
		}
		return ret;
	}
}
