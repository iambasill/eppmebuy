import { Order } from './order.entity.js';
import { TicketTier } from './ticket-tier.entity.js';
import { AddOn } from './add-on.entity.js';
export declare class OrderItem {
    id: string;
    orderId: string;
    order: Order;
    ticketTierId: string;
    ticketTier: TicketTier;
    addOnId: string;
    addOn: AddOn;
    quantity: number;
    unitPriceCents: number;
    totalPriceCents: number;
    currency: string;
    createdAt: Date;
}
