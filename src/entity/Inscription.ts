import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Event } from "./Event";
import { Stud } from "./Stud";

@Entity()
export class Inscription {
	@PrimaryColumn()
	studId: number;

	@PrimaryColumn()
	eventId: number;

	@Column()
	cost: number;

	@CreateDateColumn()
	date: Date;

	@ManyToOne(() => Stud, (event) => event.inscriptions)
	@JoinColumn({
		name: "eventId"
	})
	event: Event;

	@ManyToOne(() => Stud, (stud) => stud.inscriptions)
	@JoinColumn({
		name: "studId"
	})
	stud: Stud;
}
