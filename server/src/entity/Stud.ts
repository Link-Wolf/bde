import {
	Column,
	Entity,
	OneToMany,
	PrimaryColumn
} from "typeorm";
import { Contribution } from "./Contribution";
import { Event } from "./Event";
import { Order } from "./Order";
import { Club } from "./Club";
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
	isAdmin: boolean

	@Column({ default: 0 })
	clearance: number

	@Column()
	email: string

	@Column({
		nullable: true,
		default: null
	})
	true_email: string

	@Column({
		type: 'timestamptz',
	})
	joinDate: Date

	@Column({
		type: 'timestamptz',
		default: new Date(Date.now())
	})
	last_co: Date

	@Column({
		nullable: true,
	})
	img_medium: string;

	@Column({
		nullable: true,
	})
	img_small: string;

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

	@OneToMany(() => Club, (club) => club.contact, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
		cascade: true
	})
	clubs: Club[]

	@OneToMany(() => Inscription, (inscription) => inscription.stud, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
		cascade: true
	})
	inscription: Event[]

	isPremium: boolean;
}
