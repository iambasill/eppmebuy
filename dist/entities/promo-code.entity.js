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
exports.PromoCode = void 0;
const typeorm_1 = require("typeorm");
const index_js_1 = require("./enums/index.js");
const event_entity_js_1 = require("./event.entity.js");
const order_entity_js_1 = require("./order.entity.js");
let PromoCode = class PromoCode {
    id;
    eventId;
    event;
    code;
    discountType;
    discountValue;
    usageLimit;
    usageCount;
    validFrom;
    validUntil;
    isActive;
    createdAt;
    updatedAt;
    orders;
};
exports.PromoCode = PromoCode;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PromoCode.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_id' }),
    __metadata("design:type", String)
], PromoCode.prototype, "eventId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => event_entity_js_1.Event, (event) => event.promoCodes, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'event_id' }),
    __metadata("design:type", event_entity_js_1.Event)
], PromoCode.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PromoCode.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_type', type: 'enum', enum: index_js_1.DiscountType }),
    __metadata("design:type", String)
], PromoCode.prototype, "discountType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_value', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PromoCode.prototype, "discountValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'usage_limit', nullable: true }),
    __metadata("design:type", Number)
], PromoCode.prototype, "usageLimit", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'usage_count', default: 0 }),
    __metadata("design:type", Number)
], PromoCode.prototype, "usageCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'valid_from' }),
    __metadata("design:type", Date)
], PromoCode.prototype, "validFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'valid_until' }),
    __metadata("design:type", Date)
], PromoCode.prototype, "validUntil", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], PromoCode.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PromoCode.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PromoCode.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_js_1.Order, (order) => order.promoCode),
    __metadata("design:type", Array)
], PromoCode.prototype, "orders", void 0);
exports.PromoCode = PromoCode = __decorate([
    (0, typeorm_1.Entity)('promo_codes'),
    (0, typeorm_1.Unique)(['eventId', 'code']),
    (0, typeorm_1.Index)(['code'])
], PromoCode);
//# sourceMappingURL=promo-code.entity.js.map