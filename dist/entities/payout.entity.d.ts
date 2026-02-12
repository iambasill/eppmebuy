import { PayoutStatus } from './enums/index.js';
import { User } from './user.entity.js';
export declare class Payout {
    id: string;
    hostId: string;
    host: User;
    amountCents: number;
    currency: string;
    provider: string;
    payoutId: string;
    status: PayoutStatus;
    periodStart: Date;
    periodEnd: Date;
    orderCount: number;
    createdAt: Date;
    processedAt: Date;
}
