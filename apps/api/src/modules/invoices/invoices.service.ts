import { eq, and, sql, asc, desc } from "drizzle-orm";
import { db, type DbOrTx } from "@/db/index.js";
import { invoices, payments } from "@/db/schema/index.js";
import { getPaginationMeta } from "@/lib/pagination.js";
import { ConflictError, NotFoundError } from "@/lib/http/http-error.js";

import type {
  CreateInvoiceInput,
  CancelInvoiceInput,
  GetInvoicesQuery,
} from "@repo/validators/invoices";

const sortableColumns = {
  dueDate: invoices.dueDate,
  createdAt: invoices.createdAt,
  amount: invoices.amount,
} satisfies Record<
  GetInvoicesQuery["sortBy"],
  typeof invoices.dueDate | typeof invoices.createdAt | typeof invoices.amount
>;

export async function listInvoices(query: GetInvoicesQuery) {
  const { limit, offset, sortBy, order, status, customerId } = query;
  const orderFn = order === "asc" ? asc : desc;
  const column = sortableColumns[sortBy];

  const conditions = [];
  if (status) conditions.push(eq(invoices.status, status));
  if (customerId) conditions.push(eq(invoices.customerId, customerId));
  const where = conditions.length ? and(...conditions) : undefined;

  const [items, [{ count }]] = await Promise.all([
    db
      .select()
      .from(invoices)
      .where(where)
      .orderBy(orderFn(column))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(invoices)
      .where(where),
  ]);

  return { items, meta: getPaginationMeta(limit, offset, count) };
}

export async function getInvoiceById(id: string) {
  const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
  if (!invoice) throw new NotFoundError("Invoice not found");
  return invoice;
}

export async function createInvoice(data: CreateInvoiceInput) {
  const [invoice] = await db.insert(invoices).values(data).returning();
  return invoice;
}

export async function cancelInvoice(id: string) {
  const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
  if (!invoice) throw new NotFoundError("Invoice not found");

  if (invoice.status === "paid" || invoice.status === "partially_paid") {
    throw new ConflictError(
      "Cannot cancel an invoice that already has payments recorded",
    );
  }

  const [updated] = await db
    .update(invoices)
    .set({ status: "cancelled" })
    .where(eq(invoices.id, id))
    .returning();

  return updated;
}

export async function recalculateInvoiceStatus(
  invoiceId: string,
  tx: DbOrTx = db,
) {
  const [invoice] = await tx
    .select()
    .from(invoices)
    .where(eq(invoices.id, invoiceId));
  if (!invoice) throw new NotFoundError("Invoice not found");

  const [{ totalPaid }] = await tx
    .select({ totalPaid: sql<string>`coalesce(sum(amount), 0)` })
    .from(payments)
    .where(eq(payments.invoiceId, invoiceId));

  const paid = Number(totalPaid);
  const total = Number(invoice.amount);

  let status: "unpaid" | "partially_paid" | "paid";
  if (paid <= 0) status = "unpaid";
  else if (paid < total) status = "partially_paid";
  else status = "paid";

  await tx.update(invoices).set({ status }).where(eq(invoices.id, invoiceId));
}
