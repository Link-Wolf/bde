import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
