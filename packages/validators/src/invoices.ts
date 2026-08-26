import { z } from "zod";
import {
  paginationQuerySchema,
  createSortQuerySchema,
  idParamSchema,
  bulkIdsSchema,
} from "./common.js";
import { INVOICE_STATUS } from "./enums.js";

const invoiceBaseFields = {
  customerId: z.uuid(),
  planId: z.uuid().optional(),
  amount: z.coerce
    .number()
    .positive()
    .transform((v) => v.toFixed(2)),
  billingPeriodStart: z.coerce.date(),
  billingPeriodEnd: z.coerce.date(),
  dueDate: z.coerce.date(),
};

export const createInvoiceSchema = z.object(invoiceBaseFields);

// invoices are financial snapshots — no general update.
// Only status transitions are allowed, and only to "cancelled" manually
// ("paid"/"partially_paid" are derived automatically from payments, never set directly)
export const cancelInvoiceSchema = z.object({
  reason: z.string().max(500).optional(),
});

const INVOICE_SORT_FIELDS = ["dueDate", "createdAt", "amount"] as const;
const invoiceSortQuerySchema = createSortQuerySchema(
  INVOICE_SORT_FIELDS,
  "dueDate",
);

export const getInvoicesQuerySchema = paginationQuerySchema
  .extend(invoiceSortQuerySchema.shape)
  .extend({
    status: z.enum(INVOICE_STATUS).optional(),
    customerId: z.uuid().optional(),
  });

export const invoiceSchema = z.object({
  id: z.uuid(),
  ...invoiceBaseFields,
  status: z.enum(INVOICE_STATUS),
  createdAt: z.string(),
});

export const getInvoicesParamsSchema = idParamSchema;
export const bulkDeleteInvoicesSchema = bulkIdsSchema;
export type Invoice = z.infer<typeof invoiceSchema>;
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type CancelInvoiceInput = z.infer<typeof cancelInvoiceSchema>;
export type GetInvoicesQuery = z.infer<typeof getInvoicesQuerySchema>;
