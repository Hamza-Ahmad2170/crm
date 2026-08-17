import { user } from "./user.js"; // was: import { staff } from "./staff.js";
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
  index,
  text,
} from "drizzle-orm/pg-core";
import { customers } from "./customers.js";
import { TICKET_STATUS } from "@repo/validators/enums";

export const ticketStatusEnum = pgEnum("ticket_status", TICKET_STATUS);
export const ticketPriorityEnum = pgEnum("ticket_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);

export const tickets = pgTable(
  "tickets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "restrict" }),
    assignedTo: text("assigned_to").references(() => user.id), // was: uuid(...).references(() => staff.id)
    subject: varchar("subject", { length: 255 }).notNull(),
    description: varchar("description", { length: 2000 }),
    status: ticketStatusEnum("status").notNull().default("open"),
    priority: ticketPriorityEnum("priority").notNull().default("medium"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    resolvedAt: timestamp("resolved_at"),
  },
  (table) => [index("tickets_customer_id_idx").on(table.customerId)],
);
