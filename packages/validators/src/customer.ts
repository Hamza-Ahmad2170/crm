import { z } from "zod";

import { CUSTOMER_STATUS } from "./enums.js";

export const idParamSchema = z.object({
  id: z.uuid(),
});

export const createCustomerSchema = z.object({
  name: z.string().trim().min(1).max(255),
  phone: z.string().trim().min(1).max(20),
  cnic: z.string().trim().max(20).optional(),
  address: z.string().trim().max(500).optional(),
  areaId: z.uuid().optional(),
  planId: z.uuid().optional(),
  status: z.enum(CUSTOMER_STATUS).default("active"),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const bulkDeleteSchema = z.object({
  ids: z.array(z.uuid()).min(1),
});

export const customerListSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  search: z.string().trim().optional(),
  status: z.array(z.enum(CUSTOMER_STATUS)).optional(),
  sortBy: z
    .enum(["name", "createdAt", "status", "phone"])
    .default("createdAt"),
  sortDirection: z.enum(["asc", "desc"]).default("desc"),
});

export type CustomerListSchema = z.infer<typeof customerListSchema>;
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;