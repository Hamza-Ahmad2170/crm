import { z } from "zod";
import { paginationSchema } from "./common/index.js";

export const customerSortBySchema = z.enum([
  "name",
  "createdAt",
  "status",
  "phone",
]);
export const customerStatusSchema = z.enum(["active", "suspended", "inactive"]);

export const createCustomerSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  cnic: z.string().optional(),
  address: z.string().optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();

export const customerListSchema = z.object({
  ...paginationSchema,
  status: z.array(customerStatusSchema).optional(),
  sortBy: customerSortBySchema.default("createdAt"),
  sortDirection: z.enum(["asc", "desc"]).default("desc"),
});

export type CustomerListSchema = z.infer<typeof customerListSchema>;
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
