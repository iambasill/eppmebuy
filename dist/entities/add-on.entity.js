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
exports.AddOn = void 0;
const typeorm_1 = require("typeorm");
const event_entity_js_1 = require("./event.entity.js");
const order_item_entity_js_1 = require("./order-item.entity.js");
let AddOn = class AddOn {
    id;
    eventId;
    event;
    name;
    description;
    priceCents;
    currency;
    quantity;
    quantitySold;
    isVisible;
    createdAt;
    updatedAt;
    orderItems;
};
exports.AddOn = AddOn;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AddOn.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_id' }),
    __metadata("design:type", String)
], AddOn.prototype, "eventId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => event_entity_js_1.Event, (event) => event.addOns, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'event_id' }),
    __metadata("design:type", event_entity_js_1.Event)
], AddOn.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AddOn.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AddOn.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'price_cents' }),
    __metadata("design:type", Number)
], AddOn.prototype, "priceCents", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'USD' }),
    __metadata("design:type", String)
], AddOn.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], AddOn.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quantity_sold', default: 0 }),
    __metadata("design:type", Number)
], AddOn.prototype, "quantitySold", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_visible', default: true }),
    __metadata("design:type", Boolean)
], AddOn.prototype, "isVisible", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], AddOn.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], AddOn.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_item_entity_js_1.OrderItem, (oi) => oi.addOn),
    __metadata("design:type", Array)
], AddOn.prototype, "orderItems", void 0);
exports.AddOn = AddOn = __decorate([
    (0, typeorm_1.Entity)('add_ons'),
    (0, typeorm_1.Index)(['eventId'])
], AddOn);
//# sourceMappingURL=add-on.entity.js.map