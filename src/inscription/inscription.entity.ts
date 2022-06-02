import { Column, Entity } from "typeorm";

@Entity()
export class Inscription {
	@Column()
	date: Date

	@Column()
	cost: number
}
