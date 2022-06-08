import { IsBooleanString } from "class-validator";

export class StudDto {
	login: string;
	firstname: string;
	lastname: string;
	isPremium: boolean;
	isDirection: boolean;
}
