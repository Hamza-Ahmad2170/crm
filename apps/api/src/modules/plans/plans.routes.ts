import { Hono } from "hono";
import { zValidator } from "@/lib/http/validators.js";
import { ApiResponse } from "@/lib/http/response.js";

import * as plansService from "./plans.service.js";

import {
  getPlansQuerySchema,
  createPlanSchema,
  updatePlanSchema,
  getPlansParamsSchema,
  bulkDeletePlansSchema,
} from "@repo/validators/plans";

export const planRouter = new Hono()
  .get("/", zValidator("query", getPlansQuerySchema), async (c) => {
    const query = c.req.valid("query");
    const { items, meta } = await plansService.listPlans(query);
    return ApiResponse.paginated(c, items, meta);
  })
  .get("/:id", zValidator("param", getPlansParamsSchema), async (c) => {
    const { id } = c.req.valid("param");
    const plan = await plansService.getPlanById(id);
    return ApiResponse.success(c, plan);
  })
  .post("/", zValidator("json", createPlanSchema), async (c) => {
    const data = c.req.valid("json");
    const plan = await plansService.createPlan(data);
    return ApiResponse.created(c, plan);
  })
  .patch(
    "/:id",
    zValidator("param", getPlansParamsSchema),
    zValidator("json", updatePlanSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const data = c.req.valid("json");
      const plan = await plansService.updatePlan(id, data);
      return ApiResponse.success(c, plan);
    },
  )
  .delete("/:id", zValidator("param", getPlansParamsSchema), async (c) => {
    const { id } = c.req.valid("param");
    await plansService.deletePlan(id);
    return ApiResponse.noContent(c);
  })
  .post(
    "/bulk-delete",
    zValidator("json", bulkDeletePlansSchema),
    async (c) => {
      const { ids } = c.req.valid("json");
      const result = await plansService.bulkDeletePlans(ids);
      return ApiResponse.success(c, result);
    },
  );
