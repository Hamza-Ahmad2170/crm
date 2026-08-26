export const CUSTOMER_STATUS = ["active", "inactive", "suspended"] as const;
export type CustomerStatus = (typeof CUSTOMER_STATUS)[number];

export const PLAN_STATUS = ["active", "archived"] as const;
export type PlanStatus = (typeof PLAN_STATUS)[number];

export const TICKET_STATUS = [
  "open",
  "in_progress",
  "resolved",
  "closed",
] as const;
export type TicketStatus = (typeof TICKET_STATUS)[number];

export const TICKET_PRIORITY = ["low", "medium", "high", "urgent"] as const;
export type TicketPriority = (typeof TICKET_PRIORITY)[number];

export const INVOICE_STATUS = [
  "unpaid",
  "partially_paid",
  "paid",
  "overdue",
  "cancelled",
] as const;
export type InvoiceStatus = (typeof INVOICE_STATUS)[number];

export const PAYMENT_METHOD = [
  "cash",
  "bank_transfer",
  "jazzcash",
  "easypaisa",
  "card",
] as const;
export type PaymentMethod = (typeof PAYMENT_METHOD)[number];

export const STAFF_ROLE = [
  "admin",
  "support",
  "technician",
  "accountant",
] as const;
export type StaffRole = (typeof STAFF_ROLE)[number];

export const DEVICE_TYPE = ["router", "onu", "switch", "ap"] as const;
export type DeviceType = (typeof DEVICE_TYPE)[number];

export const DEVICE_STATUS = ["online", "offline", "unknown"] as const;
export type DeviceStatus = (typeof DEVICE_STATUS)[number];
