import { Stud } from "../entity/Stud"

export class ContributionDto {
	stud: Stud
	studLogin: string
}

export class ContributionUpdateDto {
	stud: Stud
	studLogin: string
	begin_date: string
	end_date: string
	cost: number
}
