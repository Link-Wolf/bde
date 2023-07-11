import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Event } from "./Event";
import { Club } from "./Club";
import { Inscription } from "./Inscription";
import { PingPongGame } from "./PingPongGame";

@Entity()
export class Stud {
	@PrimaryColumn()
	login: string;

	@Column({
		nullable: false,
	})
	firstname: string;

	@Column({
		nullable: false,
	})
	lastname: string;

	@Column({ default: 0 })
	clearance: number;

	@Column()
	email: string;

	@Column({
		nullable: true,
		default: null,
	})
	true_email: string;

	@Column({
		type: "timestamptz",
	})
	joinDate: Date;

	@Column({
		type: "timestamptz",
		default: new Date(Date.now()),
	})
	last_co: Date;

	@Column({
		nullable: true,
	})
	img_medium: string;

	@Column({
		nullable: true,
	})
	img_small: string;

	@OneToMany(() => Club, (club) => club.contact, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
		cascade: true,
	})
	clubs: Club[];

	@OneToMany(() => Inscription, (inscription) => inscription.stud, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
		cascade: true,
	})
	inscription: Event[];

	@OneToMany(() => PingPongGame, (game) => game.publisher, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
		cascade: true,
	})
	declaredPingPongGames: PingPongGame[];

	@OneToMany(() => PingPongGame, (game) => game.adversary, {
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
		cascade: true,
	})
	acceptedPingPongGames: PingPongGame[];

	isPremium: boolean;
}
