import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import { InscriptionService } from "../inscription/inscription.service";
import { Contribution } from "./Contribution";
import { Event } from "./Event";
import { Inscription } from "./Inscription";

@Entity()
export class Stud {
	// constructor(
	// 	private inscriptionService: InscriptionService
	// ) { }

	@PrimaryColumn()
	login: string

	@Column({
		nullable: false
	})
	firstname: string

	@Column({
		nullable: false
	})
	lastname: string

	@Column({
		nullable: true,
		default: false
	})
	isPremium: boolean

	@Column({
		nullable: true,
		default: false
	})
	isDirection: boolean

	@OneToMany(() => Contribution, (contribution) => contribution.stud, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
		cascade: true
	})
	contributions: Contribution[];

	@OneToMany(() => Inscription, (inscription) => inscription.stud)
	inscriptions: Inscription[]

	// subscribe(event: Event) {
	// 	this.inscriptionService.create(this, event)
	// }
}
