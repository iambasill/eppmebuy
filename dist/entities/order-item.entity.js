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
exports.OrderItem = void 0;
const typeorm_1 = require("typeorm");
const order_entity_js_1 = require("./order.entity.js");
const ticket_tier_entity_js_1 = require("./ticket-tier.entity.js");
const add_on_entity_js_1 = require("./add-on.entity.js");
let OrderItem = class OrderItem {
    id;
    orderId;
    order;
    ticketTierId;
    ticketTier;
    addOnId;
    addOn;
    quantity;
    unitPriceCents;
    totalPriceCents;
    currency;
    createdAt;
};
exports.OrderItem = OrderItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], OrderItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_id' }),
    __metadata("design:type", String)
], OrderItem.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_js_1.Order, (order) => order.orderItems, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", order_entity_js_1.Order)
], OrderItem.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ticket_tier_id', nullable: true }),
    __metadata("design:type", String)
], OrderItem.prototype, "ticketTierId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ticket_tier_entity_js_1.TicketTier, (tier) => tier.orderItems, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'ticket_tier_id' }),
    __metadata("design:type", ticket_tier_entity_js_1.TicketTier)
], OrderItem.prototype, "ticketTier", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'add_on_id', nullable: true }),
    __metadata("design:type", String)
], OrderItem.prototype, "addOnId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => add_on_entity_js_1.AddOn, (addOn) => addOn.orderItems, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'add_on_id' }),
    __metadata("design:type", add_on_entity_js_1.AddOn)
], OrderItem.prototype, "addOn", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], OrderItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_price_cents' }),
    __metadata("design:type", Number)
], OrderItem.prototype, "unitPriceCents", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_price_cents' }),
    __metadata("design:type", Number)
], OrderItem.prototype, "totalPriceCents", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'USD' }),
    __metadata("design:type", String)
], OrderItem.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], OrderItem.prototype, "createdAt", void 0);
exports.OrderItem = OrderItem = __decorate([
    (0, typeorm_1.Entity)('order_items'),
    (0, typeorm_1.Index)(['orderId'])
], OrderItem);
//# sourceMappingURL=order-item.entity.js.map