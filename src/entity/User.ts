import { Column, Entity, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";
import { Contribution } from "./Contribution";
import { Event } from "./Event";

@Entity()
export class User {
	@PrimaryColumn()
	login: string

	@Column()
	fullname: string

	@Column()
	isPremium: boolean

	@Column()
	isDirection: boolean

	@OneToMany(() => Contribution, (contribution) => contribution.user)
	contributions: Contribution[];

	@ManyToMany(() => Event)
	@JoinTable()
	events: Event[]
}
