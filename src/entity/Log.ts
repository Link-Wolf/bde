import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Log {
	@PrimaryGeneratedColumn({ type: "integer" })
	id: number

	@CreateDateColumn({ type: "timestamptz", default: new Date(Date.now()) })
	date: Date

	@Column({ type: "text" })
	message: string

	@Column({ type: "text" })
	type: string
}
