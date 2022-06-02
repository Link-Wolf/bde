import { User } from "src/user/user.entity";
import { Event } from "src/event/event.entity";
export declare class Inscription {
    id: number;
    date: Date;
    cost: number;
    user: User;
    event: Event;
}
