import { ArgumentMetadata } from "@nestjs/common";
import { Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class StudDtoPipe implements PipeTransform {
	transform(value: any, metadata: ArgumentMetadata) {
		if ("isPremium" in value) {
			if (value.isPremium === "true")
				value.isPremium = true;
			else
				value.isPremium = false;
		}
		if ("isDirection" in value) {
			if (value.isDirection === "true")
				value.isDirection = true;
			else
				value.isDirection = false;
		}
		return value;
	}
}
