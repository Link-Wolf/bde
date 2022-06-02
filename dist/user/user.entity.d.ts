import { Contribution } from "src/contribution/contribution.entity";
import { Inscription } from "src/inscription/inscription.entity";
export declare class User {
    login: string;
    fullname: string;
    isPremium: boolean;
    isDirection: boolean;
    contributions: Contribution[];
    inscriptions: Inscription[];
}
