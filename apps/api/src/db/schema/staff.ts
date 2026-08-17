import { pgTable, uuid, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const staffRoleEnum = pgEnum("staff_role", [
  "admin",
  "support",
  "technician",
  "accountant",
]);

export const staffStatusEnum = pgEnum("staff_status", ["active", "disabled"]);

export const staff = pgTable("staff", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),

  email: varchar("email", { length: 255 }).notNull().unique(),

  role: staffRoleEnum("role").notNull().default("support"),

  status: staffStatusEnum("status").notNull().default("active"),

  createdAt: timestamp("created_at").notNull().defaultNow(),

  deletedAt: timestamp("deleted_at"),
});
