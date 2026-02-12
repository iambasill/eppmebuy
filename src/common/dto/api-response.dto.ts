export class ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };

    static success<T>(data: T, message?: string): ApiResponse<T> {
        const response = new ApiResponse<T>();
        response.success = true;
        response.data = data;
        if (message) response.message = message;
        return response;
    }

    static paginated<T>(
        data: T,
        pagination: { page: number; limit: number; total: number },
    ): ApiResponse<T> {
        const response = new ApiResponse<T>();
        response.success = true;
        response.data = data;
        response.pagination = {
            ...pagination,
            totalPages: Math.ceil(pagination.total / pagination.limit),
        };
        return response;
    }
}
