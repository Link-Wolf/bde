import { Stud } from "./Stud";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Contribution {
	// @PrimaryGeneratedColumn()
	// id: number

	private static due(): Date {
		let due = new Date(Date.now())
		due.setMonth(due.getMonth() + 6)
		return due;
	}

	@PrimaryColumn()
	studLogin: string

	@PrimaryColumn({ type: 'timestamptz', default: new Date(Date.now()) })
	@CreateDateColumn()
	begin_date: Date

	@Column({
		nullable: true,
		default: 10
	})
	cost: number

	@Column({
		type: 'timestamptz',
		nullable: false,
		default: Contribution.due()
	})
	end_date: Date

	@ManyToOne(() => Stud, (stud) => stud.contributions, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	})
	@JoinColumn({ name: "studLogin" })
	stud: Stud
}
