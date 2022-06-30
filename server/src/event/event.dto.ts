export class EventDto {
	name: string;
	cost: number;
	place: string;
	premium_cost: number;
	nb_places: number;
	desc: string;
	consos: boolean;
	isOutside: boolean;
	sponso: boolean;
	begin_date: Date;
	end_date: Date;
}

export class EventFilterDto {
	current: boolean; //fin de levent dans le futur
	free: boolean; //gratuit
	available: boolean; //encore des places
	// subed: boolean; //billy est inscrit
	food: boolean; //ya du miam miam ou du glou glou
	unlimited: boolean;//pouvoir illimité
	outside: boolean;// pas a 42
	sponsorised: boolean;// thunas
	asc: boolean;// tri order (default desc)
	sort: string;//tri selon (default date)
}
