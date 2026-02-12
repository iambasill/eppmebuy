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
exports.UserEventScore = void 0;
const typeorm_1 = require("typeorm");
let UserEventScore = class UserEventScore {
    id;
    userId;
    eventId;
    score;
    collaborativeScore;
    contentScore;
    popularityScore;
    recencyScore;
    computedAt;
};
exports.UserEventScore = UserEventScore;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserEventScore.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], UserEventScore.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_id' }),
    __metadata("design:type", String)
], UserEventScore.prototype, "eventId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], UserEventScore.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'collaborative_score', type: 'float', nullable: true }),
    __metadata("design:type", Number)
], UserEventScore.prototype, "collaborativeScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'content_score', type: 'float', nullable: true }),
    __metadata("design:type", Number)
], UserEventScore.prototype, "contentScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'popularity_score', type: 'float', nullable: true }),
    __metadata("design:type", Number)
], UserEventScore.prototype, "popularityScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recency_score', type: 'float', nullable: true }),
    __metadata("design:type", Number)
], UserEventScore.prototype, "recencyScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'computed_at' }),
    __metadata("design:type", Date)
], UserEventScore.prototype, "computedAt", void 0);
exports.UserEventScore = UserEventScore = __decorate([
    (0, typeorm_1.Entity)('user_event_scores'),
    (0, typeorm_1.Unique)(['userId', 'eventId']),
    (0, typeorm_1.Index)(['userId', 'score']),
    (0, typeorm_1.Index)(['computedAt'])
], UserEventScore);
//# sourceMappingURL=user-event-score.entity.js.map