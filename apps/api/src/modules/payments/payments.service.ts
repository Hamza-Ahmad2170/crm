import { eq, and, sql, asc, desc } from "drizzle-orm";
import { db } from "@/db/index.js";
import { payments, invoices } from "@/db/schema/index.js";
import { getPaginationMeta } from "@/lib/pagination.js";
import { BadRequestError, NotFoundError } from "@/lib/http/http-error.js";

import type {
  CreatePaymentInput,
  GetPaymentsQuery,
} from "@repo/validators/payments";
import { recalculateInvoiceStatus } from "../invoices/invoices.service.js";

const sortableColumns = {
  createdAt: payments.createdAt,
  amount: payments.amount,
} satisfies Record<
  GetPaymentsQuery["sortBy"],
  typeof payments.createdAt | typeof payments.amount
>;

export async function listPayments(query: GetPaymentsQuery) {
  const { limit, offset, sortBy, order, invoiceId, customerId } = query;
  const orderFn = order === "asc" ? asc : desc;
  const column = sortableColumns[sortBy];

  const conditions = [];
  if (invoiceId) conditions.push(eq(payments.invoiceId, invoiceId));
  if (customerId) conditions.push(eq(payments.customerId, customerId));
  const where = conditions.length ? and(...conditions) : undefined;

  const [items, [{ count }]] = await Promise.all([
    db
      .select()
      .from(payments)
      .where(where)
      .orderBy(orderFn(column))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(payments)
      .where(where),
  ]);

  return { items, meta: getPaginationMeta(limit, offset, count) };
}

export async function createPayment(data: CreatePaymentInput) {
  return db.transaction(async (tx) => {
    const [invoice] = await tx
      .select()
      .from(invoices)
      .where(eq(invoices.id, data.invoiceId));
    if (!invoice) throw new NotFoundError("Invoice not found");
    if (invoice.status === "cancelled")
      throw new BadRequestError(
        "Cannot record a payment against a cancelled invoice",
      );

    const [payment] = await tx
      .insert(payments)
      .values({ ...data, customerId: invoice.customerId })
      .returning();

    // recompute unpaid/partially_paid/paid based on total payments so far
    await recalculateInvoiceStatus(invoice.id, tx);

    return payment;
  });
}
