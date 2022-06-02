import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class User {
	@PrimaryColumn()
	login: string

	@Column()
	firstname: string

	@Column()
	lastname: string

	@Column()
	isPremium: boolean

	@Column()
	isDirection: boolean

	@ZeroToOne(() => Contribution, (contribution) => contribution.user)
	contributions: Contribution[];

	@OneToMany(() => Inscription, (inscription) => inscription.user)
	inscriptions: Inscription[];
}
