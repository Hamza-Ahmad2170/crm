import { tickets } from "./tickets.js";
import { pgTable, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core";
import { user } from "./user.js"; // was: import { staff } from "./staff.js";

export const ticketComments = pgTable("ticket_comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  ticketId: uuid("ticket_id")
    .notNull()
    .references(() => tickets.id, { onDelete: "cascade" }),
  authorId: text("author_id").references(() => user.id), // was: uuid(...).references(() => staff.id)
  body: varchar("body", { length: 2000 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
