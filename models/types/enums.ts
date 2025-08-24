export type UserRole = "customer" | "vendor" | "admin";
export type VendorStatus = "pending" | "approved" | "rejected" | "suspended";
export type ProductStatus = "draft" | "active" | "archived";
export type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
export type PaymentProvider = "stripe" | "paypal";
export type PaymentStatus = "requires_payment" | "succeeded" | "failed" | "refunded" | "void";
export type PayoutStatus = "scheduled" | "paid" | "failed";
export type NotificationType = "order_update" | "payout_update" | "system";
