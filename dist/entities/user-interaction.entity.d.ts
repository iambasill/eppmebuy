import { InteractionType } from './enums/index.js';
import { User } from './user.entity.js';
import { Event } from './event.entity.js';
export declare class UserInteraction {
    id: string;
    userId: string;
    user: User;
    eventId: string;
    event: Event;
    interactionType: InteractionType;
    sessionId: string;
    source: string;
    deviceType: string;
    durationSeconds: number;
    scrollDepth: number;
    createdAt: Date;
}
