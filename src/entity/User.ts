import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import { Contribution } from "./Contribution";
import { Event } from "./Event";

@Entity()
export class User {
	@PrimaryColumn()
	login: string

	@Column({
		nullable: false
	})
	firstname: string

	@Column({
		nullable: false
	})
	lastname: string

	@Column({
		nullable: true,
		default: false
	})
	isPremium: boolean

	@Column({
		nullable: true,
		default: false
	})
	isDirection: boolean

<<<<<<< HEAD
	@OneToMany(() => Contribution, (contribution) => contribution.user)
	contributions: Contribution[];

	@ManyToMany(() => Event)
=======
	@OneToMany(() => Contribution, (contribution) => contribution.user, {
		onDelete: "CASCADE"
	})
	contributions: Contribution[];

	@ManyToMany(() => Event, {
		onDelete: "CASCADE"
	})
>>>>>>> 982d0de5572619535d1952ab40be3afbd008cccf
	@JoinTable({ name: 'inscriptions' })
	inscriptions: Event[]
}
