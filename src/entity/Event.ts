import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from './User'

@Entity()
export class Event {
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

	@ManyToMany(() => User)
	users: User[]
}
