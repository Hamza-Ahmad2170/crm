import { z } from "zod";
import {
  paginationQuerySchema,
  searchQuerySchema,
  createSortQuerySchema,
  bulkIdsSchema,
  idParamSchema,
} from "./common.js";
import { PLAN_STATUS } from "./enums.js";

const planBaseFields = {
  name: z.string().min(1, "Name is required").max(255),
  speedMbps: z.coerce
    .number()
    .int()
    .positive("Speed must be a positive number"),
  price: z.coerce
    .number()
    .positive("Price must be positive")
    .transform((val) => val.toFixed(2)), // numeric columns expect a string in Drizzle
};

// --- CREATE ---

// --- UPDATE ---
export const updatePlanSchema = z
  .object({
    ...planBaseFields,
    status: z.enum(PLAN_STATUS),
  })
  .partial();

// --- LIST query ---
const PLAN_SORT_FIELDS = ["name", "price", "speedMbps", "createdAt"] as const;
const planSortQuerySchema = createSortQuerySchema(
  PLAN_SORT_FIELDS,
  "createdAt",
);

export const getPlansQuerySchema = paginationQuerySchema
  .extend(planSortQuerySchema.shape)
  .extend(searchQuerySchema.shape)
  .extend({
    status: z.enum(PLAN_STATUS).optional(),
  });

// --- entity shape ---
export const planSchema = z.object({
  id: z.uuid(),
  ...planBaseFields,
  status: z.enum(PLAN_STATUS),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const createPlanSchema = z.object(planBaseFields);

export const getPlansParamsSchema = idParamSchema;
export const bulkDeletePlansSchema = bulkIdsSchema;

export type Plan = z.infer<typeof planSchema>;
export type CreatePlanInput = z.infer<typeof createPlanSchema>;
export type UpdatePlanInput = z.infer<typeof updatePlanSchema>;
export type GetPlansQuery = z.infer<typeof getPlansQuerySchema>;
