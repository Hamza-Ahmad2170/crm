import { pgTable, uuid, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { customers } from "./customers.js";

export const deviceTypeEnum = pgEnum("device_type", [
  "router",
  "onu",
  "switch",
  "ap",
]);

export const deviceStatusEnum = pgEnum("device_status", [
  "online",
  "offline",
  "unknown",
]);

export const networkDevices = pgTable("network_devices", {
  id: uuid("id").defaultRandom().primaryKey(),

  customerId: uuid("customer_id").references(() => customers.id),

  type: deviceTypeEnum("type").notNull(),

  ipAddress: varchar("ip_address", { length: 45 }),

  macAddress: varchar("mac_address", { length: 17 }),

  serialNumber: varchar("serial_number", { length: 100 }),

  status: deviceStatusEnum("status").notNull().default("unknown"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});
