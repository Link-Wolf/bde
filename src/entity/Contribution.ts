import { User } from "./User";
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Contribution {
	@PrimaryGeneratedColumn()
	id: number

	@PrimaryColumn()
	begin_date: Date

	@Column()
	cost: number

	@Column()
	end_date: Date

	@ManyToOne(() => User, (user) => user.contributions)
	user: User
}
