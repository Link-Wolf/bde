import { User } from "./User";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Contribution {
	// @PrimaryGeneratedColumn()
	// id: number

	@PrimaryColumn()
	userLogin: string

	@PrimaryColumn({ type: 'timestamptz' })
	@CreateDateColumn()
	begin_date: Date

	@Column()
	cost: number

	@Column({ type: 'timestamptz' })
	end_date: Date

	@ManyToOne(() => User, (user) => user.contributions)
	@JoinColumn({ name: "userLogin" })
	user: User
}
