import { User } from './user.entity.js';
export declare class UserFollow {
    id: string;
    followerId: string;
    followingId: string;
    follower: User;
    following: User;
    createdAt: Date;
}
