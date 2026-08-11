import { defineRelations } from 'drizzle-orm'
import * as schema from './schema/index.js'

export const relations = defineRelations(schema, (r) => ({
  user: {
    session: r.many.session(),
    account: r.many.account(),
    contact: r.many.contact(),
  },
  session: {
    user: r.one.user({
      from: r.session.userId,
      to: r.user.id,
    }),
  },
  account: {
    user: r.one.user({
      from: r.account.userId,
      to: r.user.id,
    }),
  },
  contact: {
    owner: r.one.user({
      from: r.contact.ownerId,
      to: r.user.id,
      optional: true,
    }),
  },
}))