export declare enum UserRole {
    HOST = "HOST",
    ATTENDEE = "ATTENDEE"
}
export declare enum KYCStatus {
    PENDING = "PENDING",
    SUBMITTED = "SUBMITTED",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
export declare enum PaymentMethodType {
    CARD = "CARD",
    BANK_ACCOUNT = "BANK_ACCOUNT",
    MOBILE_MONEY = "MOBILE_MONEY",
    WALLET = "WALLET",
    BANK_TRANSFER = "BANK_TRANSFER"
}
export declare enum EventStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED"
}
export declare enum EventAccessType {
    PUBLIC = "PUBLIC",
    INVITE_ONLY = "INVITE_ONLY",
    PRIVATE = "PRIVATE"
}
export declare enum TicketStatus {
    ACTIVE = "ACTIVE",
    USED = "USED",
    REFUNDED = "REFUNDED",
    CANCELLED = "CANCELLED",
    EXPIRED = "EXPIRED"
}
export declare enum OrderStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    CONFIRMED = "CONFIRMED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED",
    PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED"
}
export declare enum PaymentStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    SUCCEEDED = "SUCCEEDED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED",
    PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED"
}
export declare enum RefundStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    COMPLETED = "COMPLETED"
}
export declare enum CheckInMethod {
    QR_SCAN = "QR_SCAN",
    MANUAL = "MANUAL",
    KIOSK = "KIOSK"
}
export declare enum QRScanMode {
    SINGLE_USE = "SINGLE_USE",
    MULTI_USE = "MULTI_USE"
}
export declare enum InteractionType {
    VIEW = "VIEW",
    CLICK = "CLICK",
    SHARE = "SHARE",
    FAVORITE = "FAVORITE",
    SEARCH = "SEARCH"
}
export declare enum DiscountType {
    PERCENTAGE = "PERCENTAGE",
    FIXED_AMOUNT = "FIXED_AMOUNT"
}
export declare enum PayoutStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}
export declare enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED",
    BANNED = "BANNED",
    PENDING = "PENDING"
}
