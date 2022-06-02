import { User } from "src/user/user.entity";
export declare class Contribution {
    id: number;
    begin_date: Date;
    cost: number;
    end_date: Date;
    user: User;
}
