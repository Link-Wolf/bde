import { User } from "src/user/user.entity";
import { Event } from "src/event/event.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Inscription {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	date: Date

	@Column()
	cost: number

	@OneToMany(() => User, (user) => user.inscriptions)
	user: User

	@OneToMany(() => Event, (event) => event.inscriptions)
	event: Event
}
