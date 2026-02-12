import { User } from './user.entity.js';
import { Event } from './event.entity.js';
export declare class Favorite {
    id: string;
    userId: string;
    user: User;
    eventId: string;
    event: Event;
    createdAt: Date;
}
