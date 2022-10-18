import {
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	JoinColumn,
} from "typeorm";
import { Stud } from "./Stud";

@Entity()
export class Club {
	@PrimaryGeneratedColumn()
	id: number

	@Column({
		nullable: false
	})
	name: string

	@Column({
		nullable: false
	})
	desc: string

	@Column({
		nullable: false,
		type: "integer"
	})
	cost: number

	@Column({
		nullable: false
	})
	access: string

	@Column({
		type: "text",
		nullable: false,
	})
	goal: string

	@ManyToOne(() => Stud, (stud) => stud.clubs,
		{
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE'
		})
	@JoinColumn({ name: "login" })
	contact: Stud

	@Column({
		nullable: false
	})
	link: string

	@Column({
		type: "text",
		nullable: true,
	})
	details: string
}
