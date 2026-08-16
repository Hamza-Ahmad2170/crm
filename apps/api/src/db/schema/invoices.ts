import { plans } from "./plans.js";
import { customers } from "./customers.js";
import {
  pgTable,
  uuid,
  numeric,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "unpaid",
  "paid",
  "overdue",
  "cancelled",
]);

export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "restrict" }),
    planId: uuid("plan_id").references(() => plans.id), // snapshot reference, not live lookup
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    status: invoiceStatusEnum("status").notNull().default("unpaid"),
    billingPeriodStart: timestamp("billing_period_start").notNull(),
    billingPeriodEnd: timestamp("billing_period_end").notNull(),
    dueDate: timestamp("due_date").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("invoices_customer_id_idx").on(table.customerId),
    index("invoices_status_idx").on(table.status),
  ],
);
