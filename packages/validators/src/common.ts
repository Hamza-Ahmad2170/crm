import { z } from "zod";

export const paginationQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export const searchQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
});

export const idParamSchema = z.object({
  id: z.uuid(),
});

export const bulkIdsSchema = z.object({
  ids: z.array(z.uuid()).min(1).max(100),
});

// packages/validators/src/common.ts
export function createSortQuerySchema<T extends readonly [string, ...string[]]>(
  allowedFields: T,
  defaultField: T[number],
) {
  return z.object({
    sortBy: z.enum(allowedFields).default(defaultField),
    order: z.enum(["asc", "desc"]).default("desc"),
  });
}

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
