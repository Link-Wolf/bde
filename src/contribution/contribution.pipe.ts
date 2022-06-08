import { ArgumentMetadata } from "@nestjs/common";
import { Injectable, PipeTransform } from "@nestjs/common";
import { StudService } from "../stud/stud.service";
import { ContributionDto, ContributionUpdateDto } from "./contribution.dto";

@Injectable()
export class ContributionDtoPipe implements PipeTransform {
	constructor(
		private studService: StudService
	) { }
	async transform(value: any, metadata: ArgumentMetadata) {
		let ret = new ContributionDto();
		console.log(await this.studService.findOne(value.login));
		if ("login" in value)
			ret.stud = await this.studService.findOne(value.login)
		return ret;
	}
}
@Injectable()
export class ContributionUpdateDtoPipe implements PipeTransform {
	constructor(
		private studService: StudService
	) { }
	async transform(value: any, metadata: ArgumentMetadata) {
		let ret = new ContributionUpdateDto();
		if ("cost" in value)
			ret.cost = Number(value.cost)
		if ("login" in value)
			ret.stud = await this.studService.findOne(value.login)
		if ("begin_date" in value)
			ret.begin_date = new Date(value.begin_date)
		if ("end_date" in value)
			ret.end_date = new Date(value.end_date)
		return ret;
	}
}
