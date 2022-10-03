import {
	Column,
	Entity,
	OneToMany,
	PrimaryColumn
} from "typeorm";
import { Contribution } from "./Contribution";
import { Event } from "./Event";
import { Order } from "./Order";
import { Inscription } from "./Inscription";

@Entity()
export class Stud {
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
	isDirection: boolean

	@Column({ default: 0 })
	clearance: number

	@Column()
	email: string

	@OneToMany(() => Contribution, (contribution) => contribution.stud, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
		cascade: true
	})
	contributions: Contribution[];

	@OneToMany(() => Order, (order) => order.stud, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
		cascade: true
	})
	orders: Order[]

	@OneToMany(() => Inscription, (inscription) => inscription.stud, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
		cascade: true
	})
	inscription: Event[]

	isPremium: boolean;
}
