import { Stud } from "./Stud";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
const { contributionTime, contributionPrice } = require('../../config.json')

@Entity()
export class Contribution {
	@PrimaryGeneratedColumn()
	id: number

	private static due(): Date {
		let due = new Date(Date.now())
		due.setMonth(due.getMonth() + contributionTime)
		return due;
	}

	@Column({ type: "text" })
	studLogin: string

	@CreateDateColumn({ type: 'timestamptz', default: new Date(Date.now()) })
	begin_date: Date

	@Column({
		type: "double precision",
		nullable: true,
		default: contributionPrice
	})
	cost: number

	@Column({
		type: 'timestamptz',
		nullable: false,
		default: Contribution.due()
	})
	end_date: Date

	@ManyToOne(() => Stud, (stud) => stud.contributions,
		{
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE'
		})
	@JoinColumn({ name: "studLogin" })
	stud: Stud
}
