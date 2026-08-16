import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

export const areas = pgTable("areas", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // e.g. "Faisalabad - Madina Town"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
