"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ticket_controller_js_1 = require("./ticket.controller.js");
const ticket_service_js_1 = require("./ticket.service.js");
const ticket_entity_js_1 = require("../../entities/ticket.entity.js");
const order_entity_js_1 = require("../../entities/order.entity.js");
const user_entity_js_1 = require("../../entities/user.entity.js");
const auth_module_js_1 = require("../auth/auth.module.js");
let TicketModule = class TicketModule {
};
exports.TicketModule = TicketModule;
exports.TicketModule = TicketModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([ticket_entity_js_1.Ticket, order_entity_js_1.Order, user_entity_js_1.User]),
            auth_module_js_1.AuthModule,
        ],
        controllers: [ticket_controller_js_1.TicketController],
        providers: [ticket_service_js_1.TicketService],
    })
], TicketModule);
//# sourceMappingURL=ticket.module.js.map