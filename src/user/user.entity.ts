import { Column, Entity, PrimaryColumn } from "typeorm";

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
}
