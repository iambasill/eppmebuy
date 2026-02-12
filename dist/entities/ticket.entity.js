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
exports.Ticket = void 0;
const typeorm_1 = require("typeorm");
const index_js_1 = require("./enums/index.js");
const order_entity_js_1 = require("./order.entity.js");
const event_entity_js_1 = require("./event.entity.js");
const ticket_tier_entity_js_1 = require("./ticket-tier.entity.js");
const user_entity_js_1 = require("./user.entity.js");
const check_in_entity_js_1 = require("./check-in.entity.js");
let Ticket = class Ticket {
    id;
    ticketId;
    orderId;
    order;
    eventId;
    event;
    ticketTierId;
    ticketTier;
    ownerId;
    owner;
    issuedTo;
    issuedToEmail;
    seatNumber;
    seatZone;
    qrCodeData;
    qrCodeImageUrl;
    status;
    issuedAt;
    expiresAt;
    usedAt;
    createdAt;
    updatedAt;
    checkIns;
};
exports.Ticket = Ticket;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Ticket.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ticket_id', unique: true }),
    __metadata("design:type", String)
], Ticket.prototype, "ticketId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_id' }),
    __metadata("design:type", String)
], Ticket.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_js_1.Order, (order) => order.tickets, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", order_entity_js_1.Order)
], Ticket.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_id' }),
    __metadata("design:type", String)
], Ticket.prototype, "eventId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => event_entity_js_1.Event, (event) => event.tickets, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'event_id' }),
    __metadata("design:type", event_entity_js_1.Event)
], Ticket.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ticket_tier_id' }),
    __metadata("design:type", String)
], Ticket.prototype, "ticketTierId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ticket_tier_entity_js_1.TicketTier, (tier) => tier.tickets),
    (0, typeorm_1.JoinColumn)({ name: 'ticket_tier_id' }),
    __metadata("design:type", ticket_tier_entity_js_1.TicketTier)
], Ticket.prototype, "ticketTier", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'owner_id' }),
    __metadata("design:type", String)
], Ticket.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_js_1.User, (user) => user.tickets, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'owner_id' }),
    __metadata("design:type", user_entity_js_1.User)
], Ticket.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'issued_to_name' }),
    __metadata("design:type", String)
], Ticket.prototype, "issuedTo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'issued_to_email' }),
    __metadata("design:type", String)
], Ticket.prototype, "issuedToEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'seat_number' }),
    __metadata("design:type", String)
], Ticket.prototype, "seatNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'seat_zone', nullable: true }),
    __metadata("design:type", String)
], Ticket.prototype, "seatZone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qr_code_data' }),
    __metadata("design:type", String)
], Ticket.prototype, "qrCodeData", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qr_code_image_url' }),
    __metadata("design:type", String)
], Ticket.prototype, "qrCodeImageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: index_js_1.TicketStatus, default: index_js_1.TicketStatus.ACTIVE }),
    __metadata("design:type", String)
], Ticket.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'issued_at', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Ticket.prototype, "issuedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expires_at', nullable: true }),
    __metadata("design:type", Date)
], Ticket.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'used_at', nullable: true }),
    __metadata("design:type", Date)
], Ticket.prototype, "usedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Ticket.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Ticket.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => check_in_entity_js_1.CheckIn, (ci) => ci.ticket),
    __metadata("design:type", Array)
], Ticket.prototype, "checkIns", void 0);
exports.Ticket = Ticket = __decorate([
    (0, typeorm_1.Entity)('tickets'),
    (0, typeorm_1.Index)(['orderId']),
    (0, typeorm_1.Index)(['eventId']),
    (0, typeorm_1.Index)(['ownerId']),
    (0, typeorm_1.Index)(['status'])
], Ticket);
//# sourceMappingURL=ticket.entity.js.map