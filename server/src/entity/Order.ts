import { Stud } from "./Stud";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
const { contributionPrice } = require('../../config.json')

@Entity()
export class Order {
	@PrimaryColumn()
	id: number

	@Column({
		type: 'timestamptz',
		default: new Date(Date.now())
	})
	date: Date

	@Column()
	isCompleted: boolean

	@Column({
		type: "double precision",
		default: contributionPrice
	})
	cost: number

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
