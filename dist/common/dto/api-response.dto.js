"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    success;
    data;
    message;
    pagination;
    static success(data, message) {
        const response = new ApiResponse();
        response.success = true;
        response.data = data;
        if (message)
            response.message = message;
        return response;
    }
    static paginated(data, pagination) {
        const response = new ApiResponse();
        response.success = true;
        response.data = data;
        response.pagination = {
            ...pagination,
            totalPages: Math.ceil(pagination.total / pagination.limit),
        };
        return response;
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=api-response.dto.js.map