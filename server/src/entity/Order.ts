import { Stud } from "./Stud";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Order {
	@PrimaryColumn()
	id: number

	@Column({ type: "text" })
	studLogin: string

	@CreateDateColumn({ type: 'timestamptz', default: new Date(Date.now()) })
	begin_date: Date

	@Column()
	isCompleted: boolean

	@Column({
		type: "double precision",
		nullable: true,
		default: Number(process.env.CONTRIBUTION_PRICE)
	})
	cost: number

	@ManyToOne(() => Stud, (stud) => stud.contributions,
		{
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE'
		})
	@JoinColumn({ name: "studLogin" })
	stud: Stud
}
