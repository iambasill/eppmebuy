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
exports.GetMyTicketsDto = exports.EventTiming = exports.SortOrder = exports.TicketSortBy = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var TicketSortBy;
(function (TicketSortBy) {
    TicketSortBy["CREATED_AT"] = "createdAt";
    TicketSortBy["EVENT_START_DATE"] = "eventStartDate";
    TicketSortBy["EVENT_END_DATE"] = "eventEndDate";
})(TicketSortBy || (exports.TicketSortBy = TicketSortBy = {}));
var SortOrder;
(function (SortOrder) {
    SortOrder["ASC"] = "asc";
    SortOrder["DESC"] = "desc";
})(SortOrder || (exports.SortOrder = SortOrder = {}));
var EventTiming;
(function (EventTiming) {
    EventTiming["UPCOMING"] = "upcoming";
    EventTiming["PAST"] = "past";
    EventTiming["TODAY"] = "today";
})(EventTiming || (exports.EventTiming = EventTiming = {}));
class GetMyTicketsDto {
    page = 1;
    limit = 10;
    status;
    eventTiming;
    eventStatus;
    search;
    sortBy = TicketSortBy.CREATED_AT;
    sortOrder = SortOrder.DESC;
}
exports.GetMyTicketsDto = GetMyTicketsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], GetMyTicketsDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], GetMyTicketsDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetMyTicketsDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(EventTiming),
    __metadata("design:type", String)
], GetMyTicketsDto.prototype, "eventTiming", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetMyTicketsDto.prototype, "eventStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetMyTicketsDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(TicketSortBy),
    __metadata("design:type", String)
], GetMyTicketsDto.prototype, "sortBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(SortOrder),
    __metadata("design:type", String)
], GetMyTicketsDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=get-my-tickets.dto.js.map