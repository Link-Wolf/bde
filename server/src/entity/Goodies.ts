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
		type: "bool",
		nullable: false,
	})
	available: boolean

	@Column({
		type: 'text',
		nullable: true
	})
	thumbnail_filename: string
}
