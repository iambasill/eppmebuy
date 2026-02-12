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
exports.Payout = void 0;
const typeorm_1 = require("typeorm");
const index_js_1 = require("./enums/index.js");
const user_entity_js_1 = require("./user.entity.js");
let Payout = class Payout {
    id;
    hostId;
    host;
    amountCents;
    currency;
    provider;
    payoutId;
    status;
    periodStart;
    periodEnd;
    orderCount;
    createdAt;
    processedAt;
};
exports.Payout = Payout;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Payout.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'host_id' }),
    __metadata("design:type", String)
], Payout.prototype, "hostId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_js_1.User, (user) => user.payouts, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'host_id' }),
    __metadata("design:type", user_entity_js_1.User)
], Payout.prototype, "host", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'amount_cents' }),
    __metadata("design:type", Number)
], Payout.prototype, "amountCents", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'USD' }),
    __metadata("design:type", String)
], Payout.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Payout.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payout_id', nullable: true }),
    __metadata("design:type", String)
], Payout.prototype, "payoutId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: index_js_1.PayoutStatus, default: index_js_1.PayoutStatus.PENDING }),
    __metadata("design:type", String)
], Payout.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'period_start' }),
    __metadata("design:type", Date)
], Payout.prototype, "periodStart", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'period_end' }),
    __metadata("design:type", Date)
], Payout.prototype, "periodEnd", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_count' }),
    __metadata("design:type", Number)
], Payout.prototype, "orderCount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Payout.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'processed_at', nullable: true }),
    __metadata("design:type", Date)
], Payout.prototype, "processedAt", void 0);
exports.Payout = Payout = __decorate([
    (0, typeorm_1.Entity)('payouts'),
    (0, typeorm_1.Index)(['hostId']),
    (0, typeorm_1.Index)(['status'])
], Payout);
//# sourceMappingURL=payout.entity.js.map