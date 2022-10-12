import { Stud } from "./Stud";
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn
} from "typeorm";
const { contributionTime, contributionPrice } = require('../../config.json')

@Entity()
export class Contribution {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ type: "text" })
	studLogin: string

	@CreateDateColumn({
		type: 'timestamptz',
	})
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
