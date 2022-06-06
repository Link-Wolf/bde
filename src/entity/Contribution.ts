import { User } from "./User";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Contribution {
	// @PrimaryGeneratedColumn()
	// id: number

	@PrimaryColumn()
	userLogin: string

	@PrimaryColumn({ type: 'timestamptz' })
	@CreateDateColumn()
	begin_date: Date

	@Column({
		nullable: true,
		default: 10
	})
	cost: number

	@Column({
		type: 'timestamptz',
		nullable: false
	})
	end_date: Date

	@ManyToOne(() => User, (user) => user.contributions)
	@JoinColumn({ name: "userLogin" })
	user: User
}
