import { User } from './user.entity.js';
import { Event } from './event.entity.js';
export declare class Review {
    id: string;
    userId: string;
    user: User;
    eventId: string;
    event: Event;
    rating: number;
    title: string;
    comment: string;
    isVerifiedAttendee: boolean;
    helpfulCount: number;
    createdAt: Date;
    updatedAt: Date;
}
