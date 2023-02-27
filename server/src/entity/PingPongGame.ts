import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Stud } from "./Stud";

@Entity()
export class PingPongGame
{
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	publisher_login: string;

	@Column()
	adversary_login: string;

	@Column()
	publisher_score: number;

	@Column()
	adversary_score: number;

	@Column()
	date: Date;

	@ManyToOne(() => Stud, (stud) => stud.declaredPingPongGames,
		{
		onDelete: "CASCADE",
		onUpdate: "CASCADE"
		})
	@JoinColumn({ name: "publisher_login" })
	publisher: Stud;

	@ManyToOne(() => Stud, (stud) => stud.acceptedPingPongGames,
		{
			onDelete: "CASCADE",
			onUpdate: "CASCADE"
		})
	@JoinColumn({ name: "adversary_login"})
	adversary: Stud;
}