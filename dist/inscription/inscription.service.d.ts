import { Repository } from 'typeorm';
import { Inscription } from './inscription.entity';
export declare class InscriptionService {
    private usersRepository;
    constructor(usersRepository: Repository<Inscription>);
    findAll(): Promise<Inscription[]>;
    findOne(id: number): Promise<Inscription>;
    create(inscription: Inscription): Promise<void>;
    remove(id: number): Promise<void>;
}
