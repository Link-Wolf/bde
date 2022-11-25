import {
	Column,
	Entity,
	PrimaryColumn,
} from "typeorm";

@Entity()
export class Counter {
	@PrimaryColumn(
		{ default: "randomConnard" }
	)
	id: string

	@Column({
		default: 0
	})
	count: number
}
