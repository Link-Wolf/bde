import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Stud } from './Stud'

@Entity()
export class Event {
	@PrimaryGeneratedColumn()
	id: number

	@Column({
		nullable: false,
		type: "text",
	})
	name: string

	@Column({
		nullable: false,
		type: "integer"
	})
	cost: number

	@Column({
		nullable: false,
		type: "text"
	})
	place: string

	@Column({
		type: "integer",
		nullable: true,
		default: 0
	})
	premium_cost: number

	@Column({
		type: "integer",
		nullable: true,
		default: -42
	})
	nb_places: number

	@Column({
		type: "integer",
		nullable: true,
		default: 0
	})
	nb_premium_places: number

	@Column({
		type: "text",
		nullable: true,
	})
	desc: string

	@Column({
		type: "bool",
		nullable: false,
	})
	isOutside: boolean

	@Column({
		type: "bool",
		nullable: false,
	})
	for_pool: boolean

	@Column({
		type: "bool",
		nullable: true,
	})
	album: boolean

	@Column({
		type: "timestamptz",
		nullable: true,
		default: new Date(Date.now())
	})
	available_date: Date

	@Column({
		type: "bool",
		nullable: false,
	})
	consos: boolean

	@Column({
		type: "bool",
		nullable: false,
	})
	sponso: boolean

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

	@Column({
		type: 'text',
		nullable: true
	})
	thumbnail_filename: string

	@ManyToMany(() => Stud, (stud) => stud.inscriptions, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE"
	})
	@JoinTable({ name: 'inscriptions' })
	studs: Stud[]
}
