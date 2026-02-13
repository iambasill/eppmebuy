"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatus = exports.PayoutStatus = exports.DiscountType = exports.InteractionType = exports.QRScanMode = exports.CheckInMethod = exports.RefundStatus = exports.PaymentStatus = exports.OrderStatus = exports.TicketStatus = exports.EventAccessType = exports.EventStatus = exports.PaymentMethodType = exports.KYCStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["HOST"] = "HOST";
    UserRole["ATTENDEE"] = "ATTENDEE";
})(UserRole || (exports.UserRole = UserRole = {}));
var KYCStatus;
(function (KYCStatus) {
    KYCStatus["PENDING"] = "PENDING";
    KYCStatus["SUBMITTED"] = "SUBMITTED";
    KYCStatus["APPROVED"] = "APPROVED";
    KYCStatus["REJECTED"] = "REJECTED";
})(KYCStatus || (exports.KYCStatus = KYCStatus = {}));
var PaymentMethodType;
(function (PaymentMethodType) {
    PaymentMethodType["CARD"] = "CARD";
    PaymentMethodType["BANK_ACCOUNT"] = "BANK_ACCOUNT";
    PaymentMethodType["MOBILE_MONEY"] = "MOBILE_MONEY";
    PaymentMethodType["WALLET"] = "WALLET";
    PaymentMethodType["BANK_TRANSFER"] = "BANK_TRANSFER";
})(PaymentMethodType || (exports.PaymentMethodType = PaymentMethodType = {}));
var EventStatus;
(function (EventStatus) {
    EventStatus["DRAFT"] = "DRAFT";
    EventStatus["PUBLISHED"] = "PUBLISHED";
    EventStatus["CANCELLED"] = "CANCELLED";
    EventStatus["COMPLETED"] = "COMPLETED";
})(EventStatus || (exports.EventStatus = EventStatus = {}));
var EventAccessType;
(function (EventAccessType) {
    EventAccessType["PUBLIC"] = "PUBLIC";
    EventAccessType["INVITE_ONLY"] = "INVITE_ONLY";
    EventAccessType["PRIVATE"] = "PRIVATE";
})(EventAccessType || (exports.EventAccessType = EventAccessType = {}));
var TicketStatus;
(function (TicketStatus) {
    TicketStatus["ACTIVE"] = "ACTIVE";
    TicketStatus["USED"] = "USED";
    TicketStatus["REFUNDED"] = "REFUNDED";
    TicketStatus["CANCELLED"] = "CANCELLED";
    TicketStatus["EXPIRED"] = "EXPIRED";
})(TicketStatus || (exports.TicketStatus = TicketStatus = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["PROCESSING"] = "PROCESSING";
    OrderStatus["CONFIRMED"] = "CONFIRMED";
    OrderStatus["FAILED"] = "FAILED";
    OrderStatus["REFUNDED"] = "REFUNDED";
    OrderStatus["PARTIALLY_REFUNDED"] = "PARTIALLY_REFUNDED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PROCESSING"] = "PROCESSING";
    PaymentStatus["SUCCEEDED"] = "SUCCEEDED";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
    PaymentStatus["PARTIALLY_REFUNDED"] = "PARTIALLY_REFUNDED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var RefundStatus;
(function (RefundStatus) {
    RefundStatus["PENDING"] = "PENDING";
    RefundStatus["APPROVED"] = "APPROVED";
    RefundStatus["REJECTED"] = "REJECTED";
    RefundStatus["COMPLETED"] = "COMPLETED";
})(RefundStatus || (exports.RefundStatus = RefundStatus = {}));
var CheckInMethod;
(function (CheckInMethod) {
    CheckInMethod["QR_SCAN"] = "QR_SCAN";
    CheckInMethod["MANUAL"] = "MANUAL";
    CheckInMethod["KIOSK"] = "KIOSK";
})(CheckInMethod || (exports.CheckInMethod = CheckInMethod = {}));
var QRScanMode;
(function (QRScanMode) {
    QRScanMode["SINGLE_USE"] = "SINGLE_USE";
    QRScanMode["MULTI_USE"] = "MULTI_USE";
})(QRScanMode || (exports.QRScanMode = QRScanMode = {}));
var InteractionType;
(function (InteractionType) {
    InteractionType["VIEW"] = "VIEW";
    InteractionType["CLICK"] = "CLICK";
    InteractionType["SHARE"] = "SHARE";
    InteractionType["FAVORITE"] = "FAVORITE";
    InteractionType["SEARCH"] = "SEARCH";
})(InteractionType || (exports.InteractionType = InteractionType = {}));
var DiscountType;
(function (DiscountType) {
    DiscountType["PERCENTAGE"] = "PERCENTAGE";
    DiscountType["FIXED_AMOUNT"] = "FIXED_AMOUNT";
})(DiscountType || (exports.DiscountType = DiscountType = {}));
var PayoutStatus;
(function (PayoutStatus) {
    PayoutStatus["PENDING"] = "PENDING";
    PayoutStatus["PROCESSING"] = "PROCESSING";
    PayoutStatus["COMPLETED"] = "COMPLETED";
    PayoutStatus["FAILED"] = "FAILED";
})(PayoutStatus || (exports.PayoutStatus = PayoutStatus = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["INACTIVE"] = "INACTIVE";
    UserStatus["SUSPENDED"] = "SUSPENDED";
    UserStatus["BANNED"] = "BANNED";
    UserStatus["PENDING"] = "PENDING";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
//# sourceMappingURL=index.js.map