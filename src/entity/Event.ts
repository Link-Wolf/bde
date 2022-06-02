import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Inscription } from "../../dist/inscription/inscription.entity";

@Entity()
export class Event {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@Column()
	cost: number

	@Column()
	premium_cost: number

	@Column()
	nb_places: number

	@OneToMany(() => Inscription, (inscription) => inscription.user)
	inscriptions: Inscription[];
}
