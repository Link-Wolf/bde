import { ArgumentMetadata } from "@nestjs/common";
import { Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class EventDtoPipe implements PipeTransform {
	transform(value: any, _metadata: ArgumentMetadata) {
		if ("cost" in value)
			value.cost = Number(value.cost)
		if ("premium_cost" in value)
			value.premium_cost = Number(value.premium_cost)
		if ("place" in value)
			value.place = String(value.place)
		if ("consos" in value)
			value.consos = Boolean(value.consos)
		if ("isOutside" in value)
			value.isOutside = Boolean(value.isOutside)
		if ("nb_places" in value)
			value.nb_places = Number(value.nb_places)
		if ("begin_date" in value)
			value.begin_date = new Date(value.begin_date)
		if ("end_date" in value)
			value.end_date = new Date(value.end_date)
		return value;
	}
}
