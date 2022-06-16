import { Stud } from "../entity/Stud"

export class ContributionDto {
	stud: Stud
	begin_date: Date
	end_date: Date
	cost: number
}
