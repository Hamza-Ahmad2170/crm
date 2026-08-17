import { z } from "zod";
import { paginationQuerySchema, createSortQuerySchema } from "./common.js";
import { PAYMENT_METHOD } from "./enums.js";

const paymentBaseFields = {
  invoiceId: z.uuid(),
  amount: z.coerce
    .number()
    .positive()
    .transform((v) => v.toFixed(2)),
  method: z.enum(PAYMENT_METHOD),
  reference: z.string().max(255).optional(),
  receivedBy: z.uuid().optional(),
};

export const createPaymentSchema = z.object(paymentBaseFields);
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;

const PAYMENT_SORT_FIELDS = ["createdAt", "amount"] as const;
const paymentSortQuerySchema = createSortQuerySchema(
  PAYMENT_SORT_FIELDS,
  "createdAt",
);

export const getPaymentsQuerySchema = paginationQuerySchema
  .merge(paymentSortQuerySchema)
  .extend({
    invoiceId: z.string().uuid().optional(),
    customerId: z.string().uuid().optional(),
  });
export type GetPaymentsQuery = z.infer<typeof getPaymentsQuerySchema>;

export const paymentSchema = z.object({
  id: z.uuid(),
  ...paymentBaseFields,
  customerId: z.uuid(),
  createdAt: z.string(),
});
export type Payment = z.infer<typeof paymentSchema>;
