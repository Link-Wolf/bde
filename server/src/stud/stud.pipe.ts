import { ArgumentMetadata } from "@nestjs/common";
import { Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class StudDtoPipe implements PipeTransform {
	transform(value: any, _metadata: ArgumentMetadata) {
		if ("isDirection" in value) {
			if (value.isDirection === "true")
				value.isDirection = true;
			else
				value.isDirection = false;
		}
		return value;
	}
}
