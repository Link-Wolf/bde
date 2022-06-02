import { User } from './user.entity';
import { UserService } from './user.service';
export declare class UserController {
    private UserService;
    constructor(UserService: UserService);
    findAll(): Promise<User[]>;
    findOne(login: string): Promise<User>;
    create(user: User): void;
    remove(login: string): void;
}
