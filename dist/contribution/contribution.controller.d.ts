import { Contribution } from './contribution.entity';
import { ContributionService } from './contribution.service';
export declare class ContributionController {
    private contributionService;
    constructor(contributionService: ContributionService);
    findAll(): Promise<Contribution[]>;
    findOne(id: number): Promise<Contribution>;
    create(contribution: Contribution): void;
    remove(id: number): void;
}
