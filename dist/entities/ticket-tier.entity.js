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
exports.TicketTier = void 0;
const typeorm_1 = require("typeorm");
const event_entity_js_1 = require("./event.entity.js");
const order_item_entity_js_1 = require("./order-item.entity.js");
const ticket_entity_js_1 = require("./ticket.entity.js");
let TicketTier = class TicketTier {
    id;
    eventId;
    event;
    name;
    description;
    priceCents;
    currency;
    quantity;
    quantitySold;
    salesStart;
    salesEnd;
    isRefundable;
    refundableUntil;
    features;
    hasReservedSeating;
    seatZone;
    isVisible;
    sortOrder;
    createdAt;
    updatedAt;
    orderItems;
    tickets;
};
exports.TicketTier = TicketTier;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TicketTier.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_id' }),
    __metadata("design:type", String)
], TicketTier.prototype, "eventId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => event_entity_js_1.Event, (event) => event.ticketTiers, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'event_id' }),
    __metadata("design:type", event_entity_js_1.Event)
], TicketTier.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TicketTier.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], TicketTier.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price_cents' }),
    __metadata("design:type", Number)
], TicketTier.prototype, "priceCents", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'NGN' }),
    __metadata("design:type", String)
], TicketTier.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], TicketTier.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity_sold', default: 0 }),
    __metadata("design:type", Number)
], TicketTier.prototype, "quantitySold", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sales_start' }),
    __metadata("design:type", Date)
], TicketTier.prototype, "salesStart", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sales_end' }),
    __metadata("design:type", Date)
], TicketTier.prototype, "salesEnd", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_refundable', default: true }),
    __metadata("design:type", Boolean)
], TicketTier.prototype, "isRefundable", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'refundable_until', nullable: true }),
    __metadata("design:type", Date)
], TicketTier.prototype, "refundableUntil", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], TicketTier.prototype, "features", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'has_reserved_seating', default: false }),
    __metadata("design:type", Boolean)
], TicketTier.prototype, "hasReservedSeating", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'seat_zone', nullable: true }),
    __metadata("design:type", String)
], TicketTier.prototype, "seatZone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_visible', default: true }),
    __metadata("design:type", Boolean)
], TicketTier.prototype, "isVisible", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sort_order', default: 0 }),
    __metadata("design:type", Number)
], TicketTier.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], TicketTier.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], TicketTier.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_item_entity_js_1.OrderItem, (oi) => oi.ticketTier),
    __metadata("design:type", Array)
], TicketTier.prototype, "orderItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ticket_entity_js_1.Ticket, (ticket) => ticket.ticketTier),
    __metadata("design:type", Array)
], TicketTier.prototype, "tickets", void 0);
exports.TicketTier = TicketTier = __decorate([
    (0, typeorm_1.Entity)('ticket_tiers'),
    (0, typeorm_1.Index)(['eventId'])
], TicketTier);
//# sourceMappingURL=ticket-tier.entity.js.map