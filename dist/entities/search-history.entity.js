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
exports.SearchHistory = void 0;
const typeorm_1 = require("typeorm");
const user_entity_js_1 = require("./user.entity.js");
let SearchHistory = class SearchHistory {
    id;
    userId;
    user;
    query;
    filters;
    resultsCount;
    clickedEventId;
    createdAt;
};
exports.SearchHistory = SearchHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SearchHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], SearchHistory.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_js_1.User, (user) => user.searchHistory, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_js_1.User)
], SearchHistory.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SearchHistory.prototype, "query", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], SearchHistory.prototype, "filters", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'results_count' }),
    __metadata("design:type", Number)
], SearchHistory.prototype, "resultsCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'clicked_event_id', nullable: true }),
    __metadata("design:type", String)
], SearchHistory.prototype, "clickedEventId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SearchHistory.prototype, "createdAt", void 0);
exports.SearchHistory = SearchHistory = __decorate([
    (0, typeorm_1.Entity)('search_history'),
    (0, typeorm_1.Index)(['userId', 'createdAt'])
], SearchHistory);
//# sourceMappingURL=search-history.entity.js.map