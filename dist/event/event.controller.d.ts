import { EventService } from './event.service';
import { Event } from './event.entity';
export declare class EventController {
    private eventService;
    constructor(eventService: EventService);
    findAll(): Promise<Event[]>;
    findOne(id: number): Promise<Event>;
    create(event: Event): void;
    remove(id: number): void;
}
