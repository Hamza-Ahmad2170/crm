import { tickets } from "./tickets.js";
import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { staff } from "./staff.js";

export const ticketComments = pgTable("ticket_comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  ticketId: uuid("ticket_id")
    .notNull()
    .references(() => tickets.id, { onDelete: "cascade" }),
  authorId: uuid("author_id").references(() => staff.id),
  body: varchar("body", { length: 2000 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
