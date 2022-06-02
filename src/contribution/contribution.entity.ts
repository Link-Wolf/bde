import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Contribution {
	@PrimaryColumn()
	begin_date: Date

	@Column()
	cost: number

	@Column()
	end_date: Date
}
