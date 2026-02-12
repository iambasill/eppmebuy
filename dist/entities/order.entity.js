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
exports.Order = void 0;
const typeorm_1 = require("typeorm");
const index_js_1 = require("./enums/index.js");
const user_entity_js_1 = require("./user.entity.js");
const event_entity_js_1 = require("./event.entity.js");
const promo_code_entity_js_1 = require("./promo-code.entity.js");
const order_item_entity_js_1 = require("./order-item.entity.js");
const ticket_entity_js_1 = require("./ticket.entity.js");
const refund_entity_js_1 = require("./refund.entity.js");
let Order = class Order {
    id;
    orderReference;
    userId;
    user;
    eventId;
    event;
    status;
    subtotalCents;
    platformFeeCents;
    hostFeeCents;
    taxCents;
    discountCents;
    totalCents;
    currency;
    promoCodeId;
    promoCode;
    attendeeInfo;
    paymentProvider;
    paymentIntentId;
    paymentStatus;
    paidAt;
    createdAt;
    updatedAt;
    orderItems;
    tickets;
    refunds;
};
exports.Order = Order;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_reference', unique: true }),
    __metadata("design:type", String)
], Order.prototype, "orderReference", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], Order.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_js_1.User, (user) => user.orders, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_js_1.User)
], Order.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_id' }),
    __metadata("design:type", String)
], Order.prototype, "eventId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => event_entity_js_1.Event, (event) => event.orders, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'event_id' }),
    __metadata("design:type", event_entity_js_1.Event)
], Order.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: index_js_1.OrderStatus, default: index_js_1.OrderStatus.PENDING }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'subtotal_cents' }),
    __metadata("design:type", Number)
], Order.prototype, "subtotalCents", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'platform_fee_cents' }),
    __metadata("design:type", Number)
], Order.prototype, "platformFeeCents", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'host_fee_cents', default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "hostFeeCents", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_cents', default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "taxCents", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_cents', default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "discountCents", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_cents' }),
    __metadata("design:type", Number)
], Order.prototype, "totalCents", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'USD' }),
    __metadata("design:type", String)
], Order.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'promo_code_id', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "promoCodeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => promo_code_entity_js_1.PromoCode, (pc) => pc.orders, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'promo_code_id' }),
    __metadata("design:type", promo_code_entity_js_1.PromoCode)
], Order.prototype, "promoCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'attendee_info', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Order.prototype, "attendeeInfo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_provider', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "paymentProvider", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_intent_id', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "paymentIntentId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'payment_status',
        type: 'enum',
        enum: index_js_1.PaymentStatus,
        default: index_js_1.PaymentStatus.PENDING,
    }),
    __metadata("design:type", String)
], Order.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'paid_at', nullable: true }),
    __metadata("design:type", Date)
], Order.prototype, "paidAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Order.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_item_entity_js_1.OrderItem, (oi) => oi.order),
    __metadata("design:type", Array)
], Order.prototype, "orderItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ticket_entity_js_1.Ticket, (ticket) => ticket.order),
    __metadata("design:type", Array)
], Order.prototype, "tickets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => refund_entity_js_1.Refund, (refund) => refund.order),
    __metadata("design:type", Array)
], Order.prototype, "refunds", void 0);
exports.Order = Order = __decorate([
    (0, typeorm_1.Entity)('orders'),
    (0, typeorm_1.Index)(['userId']),
    (0, typeorm_1.Index)(['eventId']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['createdAt'])
], Order);
//# sourceMappingURL=order.entity.js.map