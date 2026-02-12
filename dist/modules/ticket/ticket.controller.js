"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketController = void 0;
const common_1 = require("@nestjs/common");
const ticket_service_js_1 = require("./ticket.service.js");
const jwt_auth_guard_js_1 = require("../auth/guards/jwt-auth.guard.js");
const get_my_tickets_dto_js_1 = require("./dto/get-my-tickets.dto.js");
const api_response_dto_js_1 = require("../../common/dto/api-response.dto.js");
let TicketController = class TicketController {
    ticketService;
    constructor(ticketService) {
        this.ticketService = ticketService;
    }
    async getMyTickets(req, query) {
        const user = req.user;
        const result = await this.ticketService.getMyTickets(user.id, query);
        return api_response_dto_js_1.ApiResponse.paginated(result.data, {
            page: result.page,
            limit: result.limit,
            total: result.total,
        });
    }
    async getMyTicketStats(req) {
        const user = req.user;
        const stats = await this.ticketService.getMyTicketStats(user.id);
        return api_response_dto_js_1.ApiResponse.success(stats);
    }
    async getMyTicketById(req, ticketId) {
        const user = req.user;
        const ticket = await this.ticketService.getMyTicketById(user.id, ticketId);
        return api_response_dto_js_1.ApiResponse.success(ticket);
    }
};
exports.TicketController = TicketController;
__decorate([
    (0, common_1.Post)('my-tickets'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_my_tickets_dto_js_1.GetMyTicketsDto]),
    __metadata("design:returntype", Promise)
], TicketController.prototype, "getMyTickets", null);
__decorate([
    (0, common_1.Post)('stats'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TicketController.prototype, "getMyTicketStats", null);
__decorate([
    (0, common_1.Post)('my-tickets/:ticketId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('ticketId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TicketController.prototype, "getMyTicketById", null);
exports.TicketController = TicketController = __decorate([
    (0, common_1.Controller)('tickets'),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard),
    __metadata("design:paramtypes", [ticket_service_js_1.TicketService])
], TicketController);
//# sourceMappingURL=ticket.controller.js.map