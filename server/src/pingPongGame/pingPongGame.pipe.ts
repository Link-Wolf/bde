import { Injectable, ArgumentMetadata, PipeTransform } from "@nestjs/common";

@Injectable()
export class PingPongGamePipe implements PipeTransform {
	transform(value: any, _metadata: ArgumentMetadata) {
		if ("publisher_score" in value)
			value.publisher_score = Number(value.publisher_score);
		if ("adversary_score" in value)
			value.adversary_score = Number(value.adversary_score);
		if ("date" in value && value.date !== null)
			value.date = new Date(value.date);
		else value.date = new Date(Date.now());
		return value;
	}
}
