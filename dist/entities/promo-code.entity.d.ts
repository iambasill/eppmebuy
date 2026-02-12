import { DiscountType } from './enums/index.js';
import { Event } from './event.entity.js';
import { Order } from './order.entity.js';
export declare class PromoCode {
    id: string;
    eventId: string;
    event: Event;
    code: string;
    discountType: DiscountType;
    discountValue: number;
    usageLimit: number;
    usageCount: number;
    validFrom: Date;
    validUntil: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    orders: Order[];
}
