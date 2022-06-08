import { InjectRepository } from "@nestjs/typeorm";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Repository } from "typeorm";
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
		type: "text",
		nullable: true,
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

	@ManyToMany(() => Stud, (stud) => stud.inscriptions, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE"
	})
	@JoinTable({ name: 'inscriptions' })
	studs: Stud[]
}
