import { ArgumentMetadata } from "@nestjs/common";
import { Injectable, PipeTransform } from "@nestjs/common";
import { UserService } from "../user/user.service";

@Injectable()
export class ContributionDtoPipe implements PipeTransform {
	constructor(
		private userService: UserService
	) { }
	transform(value: any, metadata: ArgumentMetadata) {
		if ("cost" in value)
			value.cost = Number(value.cost)
		if ("user" in value)
			value.user = this.userService.findOne(value.userLogin)
		return value;
	}
}
