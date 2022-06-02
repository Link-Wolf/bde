import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User {
	@PrimaryColumn()
	begin_date: Date

	@Column()
	cost: number

	@Column()
	end_date: Date
}
