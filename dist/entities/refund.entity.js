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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Refund = void 0;
const typeorm_1 = require("typeorm");
const index_js_1 = require("./enums/index.js");
const order_entity_js_1 = require("./order.entity.js");
let Refund = class Refund {
    id;
    orderId;
    order;
    amountCents;
    currency;
    reason;
    status;
    refundId;
    requestedAt;
    processedAt;
};
exports.Refund = Refund;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Refund.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_id' }),
    __metadata("design:type", String)
], Refund.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_js_1.Order, (order) => order.refunds, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", order_entity_js_1.Order)
], Refund.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'amount_cents' }),
    __metadata("design:type", Number)
], Refund.prototype, "amountCents", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'USD' }),
    __metadata("design:type", String)
], Refund.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Refund.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: index_js_1.RefundStatus, default: index_js_1.RefundStatus.PENDING }),
    __metadata("design:type", String)
], Refund.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'refund_id', nullable: true }),
    __metadata("design:type", String)
], Refund.prototype, "refundId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'requested_at', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Refund.prototype, "requestedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'processed_at', nullable: true }),
    __metadata("design:type", Date)
], Refund.prototype, "processedAt", void 0);
exports.Refund = Refund = __decorate([
    (0, typeorm_1.Entity)('refunds'),
    (0, typeorm_1.Index)(['orderId'])
], Refund);
//# sourceMappingURL=refund.entity.js.map