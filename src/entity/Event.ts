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

	@ManyToMany(() => User)
	users: User[]
}
