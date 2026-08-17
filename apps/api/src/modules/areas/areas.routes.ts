import { Hono } from "hono";
import { zValidator } from "@/lib/http/validators.js";
import { ApiResponse } from "@/lib/http/response.js";
import {
  createAreaSchema,
  updateAreaSchema,
  getAreasQuerySchema,
  getAreasParamsSchema,
  bulkDeleteAreasSchema,
} from "@repo/validators/areas";
import * as areasService from "./areas.service.js";

export const areaRouter = new Hono()
  .get("/", zValidator("query", getAreasQuerySchema), async (c) => {
    const query = c.req.valid("query");
    const { items, meta } = await areasService.listAreas(query);
    return ApiResponse.paginated(c, items, meta);
  })

  .get("/:id", zValidator("param", getAreasParamsSchema), async (c) => {
    const { id } = c.req.valid("param");
    const area = await areasService.getAreaById(id);
    return ApiResponse.success(c, area);
  })

  .post("/", zValidator("json", createAreaSchema), async (c) => {
    const data = c.req.valid("json");
    const area = await areasService.createArea(data);
    return ApiResponse.created(c, area);
  })

  .patch(
    "/:id",
    zValidator("param", getAreasParamsSchema),
    zValidator("json", updateAreaSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const data = c.req.valid("json");
      const area = await areasService.updateArea(id, data);
      return ApiResponse.success(c, area);
    },
  )

  .delete("/:id", zValidator("param", getAreasParamsSchema), async (c) => {
    const { id } = c.req.valid("param");
    await areasService.deleteArea(id);
    return ApiResponse.noContent(c);
  })
  .post(
    "/bulk-delete",
    zValidator("json", bulkDeleteAreasSchema),
    async (c) => {
      const { ids } = c.req.valid("json");
      const result = await areasService.bulkDeleteAreas(ids);
      return ApiResponse.success(c, result);
    },
  );
