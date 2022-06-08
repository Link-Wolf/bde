import { IsBooleanString } from "class-validator";

export class UserDto {
	login: string;
	firstname: string;
	lastname: string;
	isPremium: boolean;
	isDirection: boolean;
}
