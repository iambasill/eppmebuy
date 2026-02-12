import { PaymentMethodType } from './enums/index.js';
import { User } from './user.entity.js';
export declare class PaymentMethod {
    id: string;
    userId: string;
    user: User;
    type: PaymentMethodType;
    provider: string;
    token: string;
    last4: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}
