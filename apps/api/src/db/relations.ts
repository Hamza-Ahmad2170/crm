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
  areas: {
    customers: r.many.customers(),
  },
  plans: {
    customers: r.many.customers(),
    invoices: r.many.invoices(),
  },
  customers: {
    area: r.one.areas({
      from: r.customers.areaId,
      to: r.areas.id,
      optional: true,
    }),
    plan: r.one.plans({
      from: r.customers.planId,
      to: r.plans.id,
      optional: true,
    }),
    tickets: r.many.tickets(),
    networkDevices: r.many.networkDevices(),
    invoices: r.many.invoices(),
    payments: r.many.payments(),
  },
  staff: {
    assignedTickets: r.many.tickets(),
    ticketComments: r.many.ticketComments(),
    receivedPayments: r.many.payments(),
  },
  tickets: {
    customer: r.one.customers({
      from: r.tickets.customerId,
      to: r.customers.id,
    }),
    assignee: r.one.staff({
      from: r.tickets.assignedTo,
      to: r.staff.id,
      optional: true,
    }),
    comments: r.many.ticketComments(),
  },
  ticketComments: {
    ticket: r.one.tickets({
      from: r.ticketComments.ticketId,
      to: r.tickets.id,
    }),
    author: r.one.staff({
      from: r.ticketComments.authorId,
      to: r.staff.id,
      optional: true,
    }),
  },
  networkDevices: {
    customer: r.one.customers({
      from: r.networkDevices.customerId,
      to: r.customers.id,
      optional: true,
    }),
  },
  invoices: {
    customer: r.one.customers({
      from: r.invoices.customerId,
      to: r.customers.id,
    }),
    plan: r.one.plans({
      from: r.invoices.planId,
      to: r.plans.id,
      optional: true,
    }),
    payments: r.many.payments(),
  },
  payments: {
    invoice: r.one.invoices({
      from: r.payments.invoiceId,
      to: r.invoices.id,
    }),
    customer: r.one.customers({
      from: r.payments.customerId,
      to: r.customers.id,
    }),
    receivedBy: r.one.staff({
      from: r.payments.receivedBy,
      to: r.staff.id,
      optional: true,
    }),
  },
}))