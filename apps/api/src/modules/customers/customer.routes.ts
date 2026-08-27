import { Hono } from "hono";
import { zValidator } from "@/lib/http/validators.js";
import { ApiResponse } from "@/lib/http/response.js";

import * as customersService from "./customers.service.js";

import {
  getCustomersQuerySchema,
  createCustomerSchema,
  getCustomerParamsSchema,
  updateCustomerSchema,
  deleteCustomerParamsSchema,
  bulkDeleteCustomersSchema,
} from "@repo/validators/customers";

export const customerRouter = new Hono()
  .get("/", zValidator("query", getCustomersQuerySchema), async (c) => {
    const q = c.req.query();
    console.log("q", q);

    const query = c.req.valid("query");
    console.log("query", query);
    const { items, meta } = await customersService.listCustomers(query);
    return ApiResponse.paginated(c, items, meta);
  })
  .get("/:id", zValidator("param", getCustomerParamsSchema), async (c) => {
    const { id } = c.req.valid("param");
    const customer = await customersService.getCustomerById(id);
    return ApiResponse.success(c, customer);
  })
  .post("/", zValidator("json", createCustomerSchema), async (c) => {
    const data = c.req.valid("json");
    const customer = await customersService.createCustomer(data);
    return ApiResponse.created(c, customer);
  })
  .patch(
    "/:id",
    zValidator("param", getCustomerParamsSchema),
    zValidator("json", updateCustomerSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const data = c.req.valid("json");
      const customer = await customersService.updateCustomer(id, data);
      return ApiResponse.success(c, customer);
    },
  )
  .delete(
    "/:id",
    zValidator("param", deleteCustomerParamsSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      await customersService.deleteCustomer(id);
      return ApiResponse.noContent(c);
    },
  )
  .post(
    "/bulk-delete",
    zValidator("json", bulkDeleteCustomersSchema),
    async (c) => {
      const { ids } = c.req.valid("json");
      const result = await customersService.bulkDeleteCustomers(ids);
      return ApiResponse.success(c, result);
    },
  );
