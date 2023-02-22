import { ArgumentMetadata } from "@nestjs/common";
import { Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class StudDtoPipe implements PipeTransform {
	transform(value: any, _metadata: ArgumentMetadata) {
		return value;
	}
}
