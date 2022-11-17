export class LogsDto {
	// date: Date;
	// type: string;
	// message: string;
	// login: string;
}

export class LogsFilterDto {
	isAdmin: boolean;
	hideAdminUpdate: boolean;
	warn: boolean;
	error: boolean;
	login: string;
	asc: boolean;
}
