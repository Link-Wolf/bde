import { Contribution } from "src/contribution/contribution.entity";
import { Inscription } from "src/inscription/inscription.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

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

	@OneToMany(() => Contribution, (contribution) => contribution.user)
	contributions: Contribution[];

	@OneToMany(() => Inscription, (inscription) => inscription.user)
	inscriptions: Inscription[];
}
