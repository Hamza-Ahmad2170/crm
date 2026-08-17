import {
  pgTable,
  uuid,
  numeric,
  timestamp,
  pgEnum,
  varchar,
  text,
} from "drizzle-orm/pg-core";
import { customers } from "./customers.js";
import { invoices } from "./invoices.js";
import { user } from "./user.js"; // was: staff

export const paymentMethodEnum = pgEnum("payment_method", [
  "cash",
  "bank_transfer",
  "jazzcash",
  "easypaisa",
  "card",
]);

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  invoiceId: uuid("invoice_id")
    .notNull()
    .references(() => invoices.id, { onDelete: "restrict" }),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "restrict" }),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  method: paymentMethodEnum("method").notNull(),
  reference: varchar("reference", { length: 255 }),
  receivedBy: text("received_by").references(() => user.id), // was: uuid(...).references(() => staff.id)
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
