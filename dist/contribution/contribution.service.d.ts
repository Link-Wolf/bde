import { Repository } from 'typeorm';
import { Contribution } from './contribution.entity';
export declare class ContributionService {
    private usersRepository;
    constructor(usersRepository: Repository<Contribution>);
    findAll(): Promise<Contribution[]>;
    findOne(id: number): Promise<Contribution>;
    create(contribution: Contribution): Promise<void>;
    remove(id: number): Promise<void>;
}
