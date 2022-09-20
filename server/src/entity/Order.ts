import { Stud } from "./Stud";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
const { contributionPrice } = require('../../config.json')

@Entity()
export class Order {
	@PrimaryColumn({ type: "text" })
	id: string

	@Column({
		type: 'timestamptz',
		default: new Date(Date.now())
	})
	date: Date

	@Column({ default: false })
	isCompleted: boolean

	@Column({
		type: "double precision",
		default: contributionPrice
	})
	cost: number

	@Column({ type: "text", nullable: true })
	source: string

	@ManyToOne(() => Stud, (stud) => stud.orders,
		{
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE'
		})
	@JoinColumn({ name: "studLogin" })
	stud: Stud

	@Column({ type: "text" })
	studLogin: string
}
