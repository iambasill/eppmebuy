import { Event } from './event.entity.js';
import { OrderItem } from './order-item.entity.js';
export declare class AddOn {
    id: string;
    eventId: string;
    event: Event;
    name: string;
    description: string;
    priceCents: number;
    currency: string;
    quantity: number;
    quantitySold: number;
    isVisible: boolean;
    createdAt: Date;
    updatedAt: Date;
    orderItems: OrderItem[];
}
