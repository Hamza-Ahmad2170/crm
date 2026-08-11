import { pgTable, uuid, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const customerStatusEnum = pgEnum("customer_status", [
  "active",
  "inactive",
  "suspended",
]);

export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull().unique(),
  cnic: varchar("cnic", { length: 20 }).unique(), // national ID, optional at signup
  address: varchar("address", { length: 500 }),

  status: customerStatusEnum("status").notNull().default("active"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
});

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
