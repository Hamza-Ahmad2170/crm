import { Hono } from "hono";
import { zValidator } from "@/lib/http/validators.js";
import { ApiResponse } from "@/lib/http/response.js";

import {
  createCustomerService,
  deleteCustomerService,
  findCustomerService,
  listCustomersService,
  updateCustomerService,
} from "./customer.service.js";
import {
  idParamSchema,
  createCustomerSchema,
  updateCustomerSchema,
  customerListSchema,
} from "@repo/schema";

export const customerRouter = new Hono()
  .get("/", zValidator("query", customerListSchema), async (c) => {
    const data = c.req.valid("query");
    const { items, pagination } = await listCustomersService(data);
    return ApiResponse.paginated(c, items, pagination);
  })
  .post("/", zValidator("json", createCustomerSchema), async (c) => {
    const data = c.req.valid("json");
    const customer = await createCustomerService(data);
    return ApiResponse.created(c, customer);
  })
  .get("/:id", zValidator("param", idParamSchema), async (c) => {
    const { id } = c.req.valid("param");
    const customer = await findCustomerService(id);
    return ApiResponse.success(c, customer);
  })
  .patch(
    "/:id",
    zValidator("param", idParamSchema),
    zValidator("json", updateCustomerSchema),
    async (c) => {
      const id = c.req.param("id");
      const data = c.req.valid("json");
      const customer = await updateCustomerService(id, data);
      return ApiResponse.success(c, customer);
    },
  )
  .delete("/:id", zValidator("param", idParamSchema), async (c) => {
    const { id } = c.req.valid("param");
    const customer = await deleteCustomerService(id);
    return ApiResponse.success(c, customer);
  });
