import { z } from "zod";
import {
  paginationQuerySchema,
  searchQuerySchema,
  idParamSchema,
  bulkIdsSchema,
  createSortQuerySchema,
} from "./common.js";
import { CUSTOMER_STATUS } from "./enums.js";

const CUSTOMER_SORT_FIELDS = ["name", "createdAt", "status"] as const;
const customerSortQuerySchema = createSortQuerySchema(
  CUSTOMER_SORT_FIELDS,
  "createdAt",
);

const customerBaseFields = {
  name: z.string().min(1, "Name is required").max(255),
  phone: z.string().min(10, "Phone must be at least 10 digits").max(20),
  address: z.string().max(500).optional(),
  planId: z.uuid().optional(),
  areaId: z.uuid().optional(),
};

export const createCustomerSchema = z.object(customerBaseFields);

export const updateCustomerSchema = z
  .object({
    ...customerBaseFields,
    status: z.enum(CUSTOMER_STATUS),
  })
  .partial();

export const getCustomerParamsSchema = idParamSchema;
export const deleteCustomerParamsSchema = idParamSchema;
export const bulkDeleteCustomersSchema = bulkIdsSchema;

export const getCustomersQuerySchema = paginationQuerySchema
  .extend(customerSortQuerySchema.shape)
  .extend(searchQuerySchema.shape)
  .extend({
    status: z.enum(CUSTOMER_STATUS).optional(),
  });

export const customerSchema = z.object({
  id: z.uuid(),
  ...customerBaseFields,
  status: z.enum(CUSTOMER_STATUS),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type GetCustomersQuery = z.infer<typeof getCustomersQuerySchema>;
export type Customer = z.infer<typeof customerSchema>;
