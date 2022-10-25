import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Goodies {
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
		type: "text",
		nullable: false,
	})
	desc: string

	@Column({
		nullable: false,
		type: "integer"
	})
	s: number

	@Column({
		nullable: false,
		type: "integer"
	})
	m: number

	@Column({
		nullable: false,
		type: "integer"
	})
	l: number

	@Column({
		nullable: false,
		type: "integer"
	})
	xl: number

	@Column({
		nullable: false,
		type: "integer"
	})
	stock: number

	@Column({
		type: 'text',
		nullable: true
	})
	thumbnail_filename: string
}
