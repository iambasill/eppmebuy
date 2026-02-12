import { User } from './user.entity.js';
export declare class SearchHistory {
    id: string;
    userId: string;
    user: User;
    query: string;
    filters: any;
    resultsCount: number;
    clickedEventId: string;
    createdAt: Date;
}
