// db/schema/plans.ts
import {
  pgTable,
  uuid,
  varchar,
  integer,
  numeric,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { PLAN_STATUS } from "@repo/validators/enums";

export const planStatusEnum = pgEnum("plan_status", PLAN_STATUS);
export const billingCycleEnum = pgEnum("billing_cycle", ["monthly"]);

export const plans = pgTable("plans", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),
  speedMbps: integer("speed_mbps").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  billingCycle: billingCycleEnum("billing_cycle").notNull().default("monthly"),

  status: planStatusEnum("status").notNull().default("active"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
});

export type Plan = typeof plans.$inferSelect;
export type NewPlan = typeof plans.$inferInsert;
