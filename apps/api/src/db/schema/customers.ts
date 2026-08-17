import { plans } from "./plans.js";
import { areas } from "./areas.js";
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { CUSTOMER_STATUS } from "@repo/validators/enums";
import { sql } from "drizzle-orm";

export const customerStatusEnum = pgEnum("customer_status", CUSTOMER_STATUS);

export const customers = pgTable(
  "customers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    address: varchar("address", { length: 500 }),
    areaId: uuid("area_id").references(() => areas.id),
    planId: uuid("plan_id").references(() => plans.id, {
      onDelete: "restrict",
    }),
    status: customerStatusEnum("status").notNull().default("active"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    index("customers_name_idx").on(table.name),
    uniqueIndex("customers_phone_active_idx")
      .on(table.phone)
      .where(sql`${table.deletedAt} IS NULL`),
  ],
);

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
