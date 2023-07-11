import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Logs {
	@PrimaryGeneratedColumn({ type: "integer" })
	id: number;

	@CreateDateColumn({ type: "timestamptz" })
	date: Date;

	@Column({ default: false })
	isAdmin: boolean;

	@Column({ type: "text" })
	login: string;

	@Column({ type: "text" })
	message: string;

	@Column({ type: "text" })
	type: string;
}
