import { Entity, ManyToOne, JoinColumn, PrimaryColumn, Column } from "typeorm";
import { Stud } from "./Stud";
import { Event } from "./Event";

@Entity()
export class Inscription {
	@ManyToOne(() => Stud, (stud) => stud.inscriptions,
		{
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE'
		})
	@JoinColumn({ name: "studLogin" })
	stud: Stud

	@PrimaryColumn()
	studLogin: string

	@ManyToOne(() => Event, (event) => event.inscriptions,
		{
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE'
		})
	@JoinColumn({ name: "eventId" })
	event: Event

	@PrimaryColumn()
	eventId: number

	@Column({ default: new Date(Date.now()) })
	date: Date

	@Column({ default: 0 })
	price: number
}