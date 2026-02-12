import { RefundStatus } from './enums/index.js';
import { Order } from './order.entity.js';
export declare class Refund {
    id: string;
    orderId: string;
    order: Order;
    amountCents: number;
    currency: string;
    reason: string;
    status: RefundStatus;
    refundId: string;
    requestedAt: Date;
    processedAt: Date;
}
