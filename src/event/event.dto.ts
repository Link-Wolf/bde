export class EventDto {
	name: string;
	cost: number;
	premium_cost: number;
	nb_places: number;
	desc: string;
	begin_date: Date;
	end_date: Date;
}

export class EventSubDto {
	id: number
	login: string
}
