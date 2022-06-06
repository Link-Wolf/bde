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

	@OneToMany(() => Contribution, (contribution) => contribution.user, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE"
	})
	contributions: Contribution[];

	@ManyToMany(() => Event, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE"
	})
	@JoinTable({ name: 'inscriptions' })
	inscriptions: Event[]
}
