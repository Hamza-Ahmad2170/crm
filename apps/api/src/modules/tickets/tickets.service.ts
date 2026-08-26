import { eq, and, ilike, sql, asc, desc } from "drizzle-orm";
import { db, type DbOrTx } from "@/db/index.js";
import { tickets } from "@/db/schema/index.js";
import { getPaginationMeta } from "@/lib/pagination.js";
import {
  NotFoundError,
  BadRequestError,
} from "@/lib/http/http-error.js";
import type {
  CreateTicketInput,
  UpdateTicketInput,
  GetTicketsQuery,
} from "@repo/validators/tickets";
import type { TicketStatus } from "@repo/validators/enums";

const sortableColumns = {
  createdAt: tickets.createdAt,
  priority: tickets.priority,
  status: tickets.status,
} satisfies Record<
  GetTicketsQuery["sortBy"],
  typeof tickets.createdAt | typeof tickets.priority | typeof tickets.status
>;

const ALLOWED_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  open: ["in_progress", "closed"],
  in_progress: ["resolved", "open"],
  resolved: ["closed", "open"], // reopening a resolved ticket is allowed
  closed: ["open"], // reopening a closed ticket is allowed
};

export async function listTickets(query: GetTicketsQuery) {
  const {
    limit,
    offset,
    sortBy,
    order,
    search,
    status,
    priority,
    customerId,
    assignedTo,
  } = query;
  const orderFn = order === "asc" ? asc : desc;
  const column = sortableColumns[sortBy];

  const conditions = [];
  if (search) conditions.push(ilike(tickets.subject, `%${search}%`));
  if (status) conditions.push(eq(tickets.status, status));
  if (priority) conditions.push(eq(tickets.priority, priority));
  if (customerId) conditions.push(eq(tickets.customerId, customerId));
  if (assignedTo) conditions.push(eq(tickets.assignedTo, assignedTo));
  const where = conditions.length ? and(...conditions) : undefined;

  const [items, [{ count }]] = await Promise.all([
    db
      .select()
      .from(tickets)
      .where(where)
      .orderBy(orderFn(column))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(tickets)
      .where(where),
  ]);

  return { items, meta: getPaginationMeta(limit, offset, count) };
}

export async function getTicketById(id: string) {
  const ticket = await db.query.tickets.findFirst({
    where: {
      id,
    },
  });
  if (!ticket) throw new NotFoundError("Ticket not found");
  return ticket;
}

export async function createTicket(data: CreateTicketInput) {
  const [ticket] = await db.insert(tickets).values(data).returning();
  return ticket;
}

export async function updateTicket(id: string, data: UpdateTicketInput) {
  const [updated] = await db
    .update(tickets)
    .set(data)
    .where(eq(tickets.id, id))
    .returning();
  if (!updated) throw new NotFoundError("Ticket not found");
  return updated;
}

export async function updateTicketStatus(
  id: string,
  newStatus: TicketStatus,
  tx: DbOrTx = db,
) {
  const [ticket] = await tx.select().from(tickets).where(eq(tickets.id, id));
  if (!ticket) throw new NotFoundError("Ticket not found");

  const allowed = ALLOWED_TRANSITIONS[ticket.status as TicketStatus];
  if (!allowed.includes(newStatus)) {
    throw new BadRequestError(
      `Cannot transition ticket from "${ticket.status}" to "${newStatus}"`,
    );
  }

  const [updated] = await tx
    .update(tickets)
    .set({
      status: newStatus,
      resolvedAt:
        newStatus === "resolved"
          ? new Date()
          : newStatus === "open"
            ? null
            : ticket.resolvedAt,
    })
    .where(eq(tickets.id, id))
    .returning();

  return updated;
}
