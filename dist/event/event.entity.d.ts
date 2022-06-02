import { Inscription } from "src/inscription/inscription.entity";
export declare class Event {
    id: number;
    name: string;
    cost: number;
    premium_cost: number;
    nb_places: number;
    inscriptions: Inscription[];
}
