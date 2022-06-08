import { ArgumentMetadata } from "@nestjs/common";
import { Injectable, PipeTransform } from "@nestjs/common";
import { StudService } from "../stud/stud.service";

@Injectable()
export class ContributionDtoPipe implements PipeTransform {
	constructor(
		private studService: StudService
	) { }
	transform(value: any, metadata: ArgumentMetadata) {
		if ("cost" in value)
			value.cost = Number(value.cost)
		if ("stud" in value)
			value.stud = this.studService.findOne(value.studLogin)
		return value;
	}
}
