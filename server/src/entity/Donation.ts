import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from "typeorm";

@Entity()
export class Donation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
        type: "double",
    })
    amount: number;

    @Column({
        nullable: false,
    })
    name: string;

    @Column({
        type: "timestamptz",
        nullable: false,
    })
    date: Date;
}