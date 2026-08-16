import { z } from "zod";

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const sortQuerySchema = z.object({
  sortBy: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
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

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type SortQuery = z.infer<typeof sortQuerySchema>;
