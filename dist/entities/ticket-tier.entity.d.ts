import { Event } from './event.entity.js';
import { OrderItem } from './order-item.entity.js';
import { Ticket } from './ticket.entity.js';
export declare class TicketTier {
    id: string;
    eventId: string;
    event: Event;
    name: string;
    description: string;
    priceCents: number;
    currency: string;
    quantity: number;
    quantitySold: number;
    salesStart: Date;
    salesEnd: Date;
    isRefundable: boolean;
    refundableUntil: Date;
    features: string[];
    hasReservedSeating: boolean;
    seatZone: string;
    isVisible: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    orderItems: OrderItem[];
    tickets: Ticket[];
}
