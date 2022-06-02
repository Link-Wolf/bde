import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UserService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findAll(): Promise<User[]>;
    findOne(login: string): Promise<User>;
    create(user: User): Promise<void>;
    remove(login: string): Promise<void>;
}
