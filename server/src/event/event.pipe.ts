import {
	PipeTransform,
	Injectable,
	ArgumentMetadata,
	NotAcceptableException,
} from "@nestjs/common";

@Injectable()
export class EventDtoPipe implements PipeTransform {
	transform(value: any, _metadata: ArgumentMetadata) {
		if ("cost" in value) value.cost = Number(value.cost);
		if ("premium_cost" in value)
			value.premium_cost = Number(value.premium_cost);
		if ("place" in value) value.place = String(value.place);
		if ("consos" in value)
			if (value.consos == "1") value.consos = true;
			else value.consos = false;
		if ("isOutside" in value)
			if (value.isOutside == "1") value.isOutside = true;
			else value.isOutside = false;
		if ("for_pool" in value)
			if (value.for_pool == "1") value.for_pool = true;
			else value.for_pool = false;
		if ("sponso" in value)
			if (value.sponso == "1") value.sponso = true;
			else value.sponso = false;
		if ("album" in value)
			if (value.album == "1") value.album = true;
			else value.album = false;
		if ("nb_places" in value) value.nb_places = Number(value.nb_places);
		if ("begin_date" in value)
			value.begin_date = new Date(value.begin_date);
		if ("available_date" in value && value.available_date !== null)
			value.available_date = new Date(value.available_date);
		else value.available_date = new Date(Date.now());
		if ("sub_date" in value && value.sub_date !== null)
			value.sub_date = new Date(value.sub_date);
		if ("end_date" in value && value.end_date !== null)
			value.end_date = new Date(value.end_date);
		if ("desc" in value && value.desc === "") value.desc = value.name;
		return value;
	}
}

@Injectable()
export class EventFilterDtoPipe implements PipeTransform {
	transform(value: any, _metadata: ArgumentMetadata) {
		if ("current" in value && value.current == "1") value.current = true;
		else value.current = false;
		if ("free" in value && value.free == "1") value.free = true;
		else value.free = false;
		if ("available" in value && value.available == "1")
			value.available = true;
		else value.available = false;
		if ("album" in value && value.album == "1") value.album = true;
		else value.album = false;
		if ("available_date" in value && value.available_date == 1)
			value.available_date = true;
		else value.available_date = false;
		if ("food" in value && value.food == "1") value.food = true;
		else value.food = false;
		if ("unlimited" in value && value.unlimited == "1")
			value.unlimited = true;
		else value.unlimited = false;
		if ("outside" in value && value.outside == "1") value.outside = true;
		else value.outside = false;
		if ("sponso" in value && value.sponso == "1") value.sponso = true;
		else value.sponso = false;
		if ("asc" in value && value.asc == "1") value.asc = true;
		else value.asc = false;
		if (
			!(
				"sort" in value &&
				["begin_date", "name", "place", "cost"].includes(value.sort)
			)
		)
			value.sort = "begin_date";
		return value;
	}
}

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
	transform(value: any, _metadata: ArgumentMetadata) {
		if (value == undefined) {
			return undefined;
		} else if (value.mimetype.split("/")[0] === "image") return value;
		else throw new NotAcceptableException();
	}
}
