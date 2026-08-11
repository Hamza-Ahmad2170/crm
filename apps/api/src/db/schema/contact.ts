import { index, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { user } from './user.js'

export const contact = pgTable(
  'contact',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    ownerId: text('owner_id').references(() => user.id, { onDelete: 'set null' }),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }),
    phone: varchar('phone', { length: 50 }),
    company: varchar('company', { length: 255 }),
    status: varchar('status', { length: 50 }).notNull().default('lead'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('contact_owner_id_idx').on(table.ownerId),
    index('contact_email_idx').on(table.email),
  ],
)