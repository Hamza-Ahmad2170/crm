export const CUSTOMER_STATUS = ["active", "inactive", "suspended"] as const;
export type CustomerStatus = (typeof CUSTOMER_STATUS)[number];

export const PLAN_STATUS = ["active", "archived"] as const;
export type PlanStatus = (typeof PLAN_STATUS)[number];

export const INVOICE_STATUS = [
  "unpaid",
  "paid",
  "overdue",
  "cancelled",
] as const;
export type InvoiceStatus = (typeof INVOICE_STATUS)[number];

export const TICKET_STATUS = [
  "open",
  "in_progress",
  "resolved",
  "closed",
] as const;
export type TicketStatus = (typeof TICKET_STATUS)[number];

export const TICKET_PRIORITY = ["low", "medium", "high", "urgent"] as const;
export type TicketPriority = (typeof TICKET_PRIORITY)[number];
