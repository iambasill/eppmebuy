export declare class ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    static success<T>(data: T, message?: string): ApiResponse<T>;
    static paginated<T>(data: T, pagination: {
        page: number;
        limit: number;
        total: number;
    }): ApiResponse<T>;
}
