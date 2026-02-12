import { User } from './user.entity.js';
export declare class CustomerSupport {
    id: string;
    userId: string;
    user: User;
    subject: string;
    message: string;
    category: string;
    status: string;
    createdAt: Date;
}
