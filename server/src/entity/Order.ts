import { Stud } from "./Stud";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Order {
	@PrimaryColumn({ type: "text" })
	id: string

	@Column({})
	type: number

	@Column({
		type: 'timestamptz',
	})
	date: Date

	@Column({
		type: "text",
		nullable: false
	})
	address: string

	@Column({
		type: "text",
		nullable: false
	})
	city: string

	@Column({ default: false })
	isCompleted: boolean

	@Column({ default: false })
	isMailed: boolean

	@Column({
		type: "double precision",
		default: process.env.CONTRIBUTION_PRICE
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
