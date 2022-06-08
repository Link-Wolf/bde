import { ArgumentMetadata } from "@nestjs/common";
import { Injectable, PipeTransform } from "@nestjs/common";
import { StudService } from "../stud/stud.service";

@Injectable()
export class ContributionDtoPipe implements PipeTransform {
	constructor(
		private studService: StudService
	) { }
	transform(value: any, metadata: ArgumentMetadata) {
		let ret: ContributionDto;
		if ("cost" in value)
			ret.cost = Number(value.cost)
		if ("stud" in value)
			ret.stud = this.studService.findOne(value.studLogin)
		if ("begin_date" in value)
			ret.begin_date = new Date(value.begin_date)
		if ("end_date" in value)
			ret.end_date = new Date(value.end_date)
		console.log(ret);
		return ret;
	}
}
