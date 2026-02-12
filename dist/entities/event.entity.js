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
exports.Event = void 0;
const typeorm_1 = require("typeorm");
const index_js_1 = require("./enums/index.js");
const user_entity_js_1 = require("./user.entity.js");
const ticket_tier_entity_js_1 = require("./ticket-tier.entity.js");
const add_on_entity_js_1 = require("./add-on.entity.js");
const promo_code_entity_js_1 = require("./promo-code.entity.js");
const order_entity_js_1 = require("./order.entity.js");
const ticket_entity_js_1 = require("./ticket.entity.js");
const check_in_entity_js_1 = require("./check-in.entity.js");
const review_entity_js_1 = require("./review.entity.js");
const user_interaction_entity_js_1 = require("./user-interaction.entity.js");
const favorite_entity_js_1 = require("./favorite.entity.js");
let Event = class Event {
    id;
    title;
    slug;
    description;
    coverImages;
    startDateTime;
    endDateTime;
    venueName;
    venueAddress;
    city;
    state;
    country;
    isOnline;
    streamingUrl;
    status;
    accessType;
    timezone;
    category;
    refundableUntil;
    hostId;
    host;
    createdAt;
    updatedAt;
    ticketTiers;
    addOns;
    promoCodes;
    orders;
    tickets;
    checkIns;
    reviews;
    interactions;
    favorites;
};
exports.Event = Event;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Event.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Event.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Event.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Event.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], Event.prototype, "coverImages", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Event.prototype, "startDateTime", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Event.prototype, "endDateTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Event.prototype, "venueName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Event.prototype, "venueAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Event.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Event.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Event.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Event.prototype, "isOnline", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Event.prototype, "streamingUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: index_js_1.EventStatus, default: index_js_1.EventStatus.DRAFT }),
    __metadata("design:type", String)
], Event.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: index_js_1.EventAccessType, default: index_js_1.EventAccessType.PUBLIC }),
    __metadata("design:type", String)
], Event.prototype, "accessType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Event.prototype, "timezone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Event.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Event.prototype, "refundableUntil", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'host_id' }),
    __metadata("design:type", String)
], Event.prototype, "hostId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_js_1.User, (user) => user.hostedEvents, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'host_id' }),
    __metadata("design:type", user_entity_js_1.User)
], Event.prototype, "host", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Event.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Event.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ticket_tier_entity_js_1.TicketTier, (tier) => tier.event),
    __metadata("design:type", Array)
], Event.prototype, "ticketTiers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => add_on_entity_js_1.AddOn, (addOn) => addOn.event),
    __metadata("design:type", Array)
], Event.prototype, "addOns", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => promo_code_entity_js_1.PromoCode, (pc) => pc.event),
    __metadata("design:type", Array)
], Event.prototype, "promoCodes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_js_1.Order, (order) => order.event),
    __metadata("design:type", Array)
], Event.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ticket_entity_js_1.Ticket, (ticket) => ticket.event),
    __metadata("design:type", Array)
], Event.prototype, "tickets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => check_in_entity_js_1.CheckIn, (ci) => ci.event),
    __metadata("design:type", Array)
], Event.prototype, "checkIns", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => review_entity_js_1.Review, (review) => review.event),
    __metadata("design:type", Array)
], Event.prototype, "reviews", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_interaction_entity_js_1.UserInteraction, (ui) => ui.event),
    __metadata("design:type", Array)
], Event.prototype, "interactions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => favorite_entity_js_1.Favorite, (fav) => fav.event),
    __metadata("design:type", Array)
], Event.prototype, "favorites", void 0);
exports.Event = Event = __decorate([
    (0, typeorm_1.Entity)('events')
], Event);
//# sourceMappingURL=event.entity.js.map