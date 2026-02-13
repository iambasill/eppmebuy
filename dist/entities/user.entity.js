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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const index_js_1 = require("./enums/index.js");
const user_follow_entity_js_1 = require("./user-follow.entity.js");
const payment_method_entity_js_1 = require("./payment-method.entity.js");
const order_entity_js_1 = require("./order.entity.js");
const ticket_entity_js_1 = require("./ticket.entity.js");
const review_entity_js_1 = require("./review.entity.js");
const user_interaction_entity_js_1 = require("./user-interaction.entity.js");
const favorite_entity_js_1 = require("./favorite.entity.js");
const search_history_entity_js_1 = require("./search-history.entity.js");
const notification_entity_js_1 = require("./notification.entity.js");
const payout_entity_js_1 = require("./payout.entity.js");
const check_in_entity_js_1 = require("./check-in.entity.js");
const event_entity_js_1 = require("./event.entity.js");
const customer_support_entity_js_1 = require("./customer-support.entity.js");
const user_session_entity_js_1 = require("./user-session.entity.js");
let User = class User {
    id;
    firstName;
    lastName;
    email;
    password;
    phoneNumber;
    role;
    status;
    googleId;
    facebookId;
    emailVerified;
    profilePictureUrl;
    organizationName;
    contactEmail;
    contactPhone;
    createdAt;
    updatedAt;
    following;
    followers;
    paymentMethods;
    orders;
    tickets;
    reviews;
    interactions;
    favorites;
    searchHistory;
    notifications;
    payouts;
    scannedCheckIns;
    hostedEvents;
    supportRequests;
    sessions;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: index_js_1.UserRole, default: index_js_1.UserRole.ATTENDEE }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: index_js_1.UserStatus, default: index_js_1.UserStatus.ACTIVE }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "googleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "facebookId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "emailVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "profilePictureUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "organizationName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "contactEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "contactPhone", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_follow_entity_js_1.UserFollow, (follow) => follow.follower),
    __metadata("design:type", Array)
], User.prototype, "following", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_follow_entity_js_1.UserFollow, (follow) => follow.following),
    __metadata("design:type", Array)
], User.prototype, "followers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_method_entity_js_1.PaymentMethod, (pm) => pm.user),
    __metadata("design:type", Array)
], User.prototype, "paymentMethods", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_js_1.Order, (order) => order.user),
    __metadata("design:type", Array)
], User.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ticket_entity_js_1.Ticket, (ticket) => ticket.owner),
    __metadata("design:type", Array)
], User.prototype, "tickets", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => review_entity_js_1.Review, (review) => review.user),
    __metadata("design:type", Array)
], User.prototype, "reviews", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_interaction_entity_js_1.UserInteraction, (interaction) => interaction.user),
    __metadata("design:type", Array)
], User.prototype, "interactions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => favorite_entity_js_1.Favorite, (fav) => fav.user),
    __metadata("design:type", Array)
], User.prototype, "favorites", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => search_history_entity_js_1.SearchHistory, (sh) => sh.user),
    __metadata("design:type", Array)
], User.prototype, "searchHistory", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_entity_js_1.Notification, (n) => n.user),
    __metadata("design:type", Array)
], User.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payout_entity_js_1.Payout, (p) => p.host),
    __metadata("design:type", Array)
], User.prototype, "payouts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => check_in_entity_js_1.CheckIn, (ci) => ci.scanner),
    __metadata("design:type", Array)
], User.prototype, "scannedCheckIns", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => event_entity_js_1.Event, (e) => e.host),
    __metadata("design:type", Array)
], User.prototype, "hostedEvents", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => customer_support_entity_js_1.CustomerSupport, (cs) => cs.user),
    __metadata("design:type", Array)
], User.prototype, "supportRequests", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_session_entity_js_1.UserSession, (session) => session.user),
    __metadata("design:type", Array)
], User.prototype, "sessions", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map