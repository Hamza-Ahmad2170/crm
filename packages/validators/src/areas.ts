import { z } from "zod";
import {
  paginationQuerySchema,
  searchQuerySchema,
  createSortQuerySchema,
  idParamSchema,
  bulkIdsSchema,
} from "./common.js";

const areaBaseFields = {
  name: z.string().min(1, "Name is required").max(255),
};

export const createAreaSchema = z.object(areaBaseFields);
export const updateAreaSchema = z.object(areaBaseFields).partial();

const AREA_SORT_FIELDS = ["name", "createdAt"] as const;
const areaSortQuerySchema = createSortQuerySchema(AREA_SORT_FIELDS, "name");

export const getAreasQuerySchema = paginationQuerySchema
  .extend(areaSortQuerySchema.shape)
  .extend(searchQuerySchema.shape);

export const areaSchema = z.object({
  id: z.uuid(),
  ...areaBaseFields,
  createdAt: z.string(),
});

export const bulkDeleteAreasSchema = bulkIdsSchema;
export const getAreasParamsSchema = idParamSchema;
export type Area = z.infer<typeof areaSchema>;
export type CreateAreaInput = z.infer<typeof createAreaSchema>;
export type UpdateAreaInput = z.infer<typeof updateAreaSchema>;
export type GetAreasQuery = z.infer<typeof getAreasQuerySchema>;
