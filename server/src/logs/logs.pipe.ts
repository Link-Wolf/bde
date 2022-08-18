import { ArgumentMetadata } from "@nestjs/common";
import { Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class LogsDtoPipe implements PipeTransform {
	transform(value: any, _metadata: ArgumentMetadata) {
		// if ("cost" in value)
		// 	value.cost = Number(value.cost)
		// if ("premium_cost" in value)
		// 	value.premium_cost = Number(value.premium_cost)
		// if ("place" in value)
		// 	value.place = String(value.place)
		// if ("consos" in value)
		// 	if (value.consos == '1')
		// 		value.consos = true
		// 	else
		// 		value.consos = false
		// if ("isOutside" in value)
		// 	if (value.isOutside == '1')
		// 		value.isOutside = true
		// 	else
		// 		value.isOutside = false
		// if ("nb_places" in value)
		// 	value.nb_places = Number(value.nb_places)
		// if ("begin_date" in value)
		// 	value.begin_date = new Date(value.begin_date)
		// if ("end_date" in value)
		// 	value.end_date = new Date(value.end_date)
		return value;
	}
}

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
