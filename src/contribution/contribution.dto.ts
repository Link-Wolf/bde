import { User } from "../entity/User"

export class ContributionDto {
	user: User
	userLogin: string
}

export class ContributionUpdateDto {
	user: User
	userLogin: string
	begin_date: string
	end_date: string
	cost: number
}
