import { Inscription } from './inscription.entity';
import { InscriptionService } from './inscription.service';
export declare class InscriptionController {
    private inscriptionService;
    constructor(inscriptionService: InscriptionService);
    findAll(): Promise<Inscription[]>;
    findOne(id: number): Promise<Inscription>;
    create(inscription: Inscription): void;
    remove(id: number): void;
}
