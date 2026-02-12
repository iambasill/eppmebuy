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
exports.CheckIn = void 0;
const typeorm_1 = require("typeorm");
const index_js_1 = require("./enums/index.js");
const ticket_entity_js_1 = require("./ticket.entity.js");
const event_entity_js_1 = require("./event.entity.js");
const user_entity_js_1 = require("./user.entity.js");
let CheckIn = class CheckIn {
    id;
    ticketId;
    ticket;
    eventId;
    event;
    scannerId;
    scanner;
    method;
    deviceInfo;
    checkedInAt;
};
exports.CheckIn = CheckIn;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CheckIn.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ticket_id' }),
    __metadata("design:type", String)
], CheckIn.prototype, "ticketId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ticket_entity_js_1.Ticket, (ticket) => ticket.checkIns, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'ticket_id' }),
    __metadata("design:type", ticket_entity_js_1.Ticket)
], CheckIn.prototype, "ticket", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_id' }),
    __metadata("design:type", String)
], CheckIn.prototype, "eventId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => event_entity_js_1.Event, (event) => event.checkIns, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'event_id' }),
    __metadata("design:type", event_entity_js_1.Event)
], CheckIn.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'scanner_id', nullable: true }),
    __metadata("design:type", String)
], CheckIn.prototype, "scannerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_js_1.User, (user) => user.scannedCheckIns, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'scanner_id' }),
    __metadata("design:type", user_entity_js_1.User)
], CheckIn.prototype, "scanner", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: index_js_1.CheckInMethod }),
    __metadata("design:type", String)
], CheckIn.prototype, "method", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'device_info', type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], CheckIn.prototype, "deviceInfo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'checked_in_at' }),
    __metadata("design:type", Date)
], CheckIn.prototype, "checkedInAt", void 0);
exports.CheckIn = CheckIn = __decorate([
    (0, typeorm_1.Entity)('check_ins'),
    (0, typeorm_1.Index)(['ticketId']),
    (0, typeorm_1.Index)(['eventId'])
], CheckIn);
//# sourceMappingURL=check-in.entity.js.map