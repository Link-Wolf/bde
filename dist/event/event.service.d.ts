import { Repository } from 'typeorm';
import { Event } from './event.entity';
export declare class EventService {
    private usersRepository;
    constructor(usersRepository: Repository<Event>);
    findAll(): Promise<Event[]>;
    findOne(id: number): Promise<Event>;
    create(event: Event): Promise<void>;
    remove(id: number): Promise<void>;
}
