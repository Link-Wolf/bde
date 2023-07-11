import { ArgumentMetadata } from "@nestjs/common";
import { Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class LogsFilterDtoPipe implements PipeTransform {
	transform(value: any, _metadata: ArgumentMetadata) {
		if ("warn" in value && value.warn == '1')
			value.warn = true
		else
			value.warn = false
		if ("error" in value && value.error == '1')
			value.error = true
		else
			value.error = false
		return value;
	}
}
