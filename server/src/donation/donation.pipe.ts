import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class DonationDtoPipe implements PipeTransform {
	async transform(value: any, _metadata: ArgumentMetadata) {
		let { login, ...ret } = value;
		if ("amount" in value) ret.amount = Number(value.amount);
		if ("name" in value) ret.name = String(value.name);
		if ("date" in value) ret.date = new Date(value.date);
		return ret;
	}
}
