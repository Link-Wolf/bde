import { ArgumentMetadata } from "@nestjs/common";
import { Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class StudDtoPipe implements PipeTransform {
	transform(value: any, _metadata: ArgumentMetadata) {
		if ("isAdmin" in value) {
			if (value.isAdmin === "true")
				value.isAdmin = true;
			else
				value.isAdmin = false;
		}
		return value;
	}
}
