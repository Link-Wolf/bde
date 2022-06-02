import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, JoinTable } from "typeorm";
import { User } from './User'

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

	@ManyToMany(() => User)
	@JoinTable()
	users: User[]
}
