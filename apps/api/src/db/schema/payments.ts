import {
  pgTable,
  uuid,
  numeric,
  timestamp,
  pgEnum,
  varchar,
} from "drizzle-orm/pg-core";
import { customers } from "./customers.js";
import { invoices } from "./invoices.js";
import { staff } from "./staff.js";

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
  reference: varchar("reference", { length: 255 }), // transaction ID / receipt number
  receivedBy: uuid("received_by").references(() => staff.id), // who collected it
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
