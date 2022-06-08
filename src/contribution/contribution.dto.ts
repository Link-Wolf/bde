import { Stud } from "../entity/Stud"

export class ContributionDto {
	stud: Stud
}

export class ContributionUpdateDto {
	stud: Stud
	begin_date: Date
	end_date: Date
	cost: number
}
