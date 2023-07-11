import {
	PipeTransform,
	Injectable,
	ArgumentMetadata,
	NotAcceptableException,
} from "@nestjs/common";

@Injectable()
export class GoodiesDtoPipe implements PipeTransform {
	transform(value: any, _metadata: ArgumentMetadata) {
		if ("cost" in value) value.cost = Number(value.cost);
		if ("available" in value)
			if (value.available == "1") value.available = true;
			else value.available = false;
		return value;
	}
}

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
	transform(value: any, _metadata: ArgumentMetadata) {
		if (value !== undefined && value.mimetype.split("/")[0] === "image")
			return value;
		else throw new NotAcceptableException();
	}
}
