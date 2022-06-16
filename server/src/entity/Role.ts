import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Stud } from "./Stud";

@Entity()
export class Role {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@Column()
	canDelete: boolean

	@Column()
	canPost: boolean

	@Column()
	canGet: boolean

	@Column()
	canPatch: boolean

	@ManyToMany(() => Stud, (stud) => stud.roles, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
		cascade: true
	})
	studs: Stud[]
}
