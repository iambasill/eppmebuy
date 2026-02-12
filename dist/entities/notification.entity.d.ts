import { User } from './user.entity.js';
export declare class Notification {
    id: string;
    userId: string;
    user: User;
    type: string;
    title: string;
    message: string;
    data: any;
    isRead: boolean;
    createdAt: Date;
}
