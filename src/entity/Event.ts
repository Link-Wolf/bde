import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { InscriptionService } from "../inscription/inscription.service";
import { Inscription } from "./Inscription";
import { Stud } from "./Stud";

@Entity()
export class Event {
	// constructor(
	// 	private inscriptionService: InscriptionService
	// ) { }

	@PrimaryGeneratedColumn()
	id: number

	@Column({
		nullable: false
	})
	name: string

	@Column({
		nullable: false
	})
	cost: number

	@Column({
		nullable: true,
		default: 0
	})
	premium_cost: number

	@Column({
		nullable: true,
		default: -42
	})
	nb_places: number

	@Column({
		nullable: true,
		length: 4242
	})
	desc: string

	@Column({
		type: 'timestamptz',
		nullable: false
	})
	begin_date: Date

	@Column({
		type: 'timestamptz',
		nullable: true
	})
	end_date: Date

	@OneToMany(() => Inscription, (inscription) => inscription.event)
	inscriptions: Inscription

	// subscribe(stud: Stud) {
	// 	this.inscriptionService.create(stud, this)
	// }
}
