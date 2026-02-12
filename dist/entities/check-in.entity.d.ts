import { CheckInMethod } from './enums/index.js';
import { Ticket } from './ticket.entity.js';
import { Event } from './event.entity.js';
import { User } from './user.entity.js';
export declare class CheckIn {
    id: string;
    ticketId: string;
    ticket: Ticket;
    eventId: string;
    event: Event;
    scannerId: string;
    scanner: User;
    method: CheckInMethod;
    deviceInfo: any;
    checkedInAt: Date;
}
