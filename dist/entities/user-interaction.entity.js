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
exports.UserInteraction = void 0;
const typeorm_1 = require("typeorm");
const index_js_1 = require("./enums/index.js");
const user_entity_js_1 = require("./user.entity.js");
const event_entity_js_1 = require("./event.entity.js");
let UserInteraction = class UserInteraction {
    id;
    userId;
    user;
    eventId;
    event;
    interactionType;
    sessionId;
    source;
    deviceType;
    durationSeconds;
    scrollDepth;
    createdAt;
};
exports.UserInteraction = UserInteraction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserInteraction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], UserInteraction.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_js_1.User, (user) => user.interactions, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_js_1.User)
], UserInteraction.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_id' }),
    __metadata("design:type", String)
], UserInteraction.prototype, "eventId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => event_entity_js_1.Event, (event) => event.interactions, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'event_id' }),
    __metadata("design:type", event_entity_js_1.Event)
], UserInteraction.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'interaction_type', type: 'enum', enum: index_js_1.InteractionType }),
    __metadata("design:type", String)
], UserInteraction.prototype, "interactionType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_id', nullable: true }),
    __metadata("design:type", String)
], UserInteraction.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserInteraction.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'device_type', nullable: true }),
    __metadata("design:type", String)
], UserInteraction.prototype, "deviceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'duration_seconds', nullable: true }),
    __metadata("design:type", Number)
], UserInteraction.prototype, "durationSeconds", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'scroll_depth', nullable: true }),
    __metadata("design:type", Number)
], UserInteraction.prototype, "scrollDepth", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], UserInteraction.prototype, "createdAt", void 0);
exports.UserInteraction = UserInteraction = __decorate([
    (0, typeorm_1.Entity)('user_interactions'),
    (0, typeorm_1.Index)(['userId', 'createdAt']),
    (0, typeorm_1.Index)(['eventId', 'interactionType'])
], UserInteraction);
//# sourceMappingURL=user-interaction.entity.js.map