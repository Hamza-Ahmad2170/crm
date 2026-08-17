import { Hono } from "hono";
import { zValidator } from "@/lib/http/validators.js";
import { ApiResponse } from "@/lib/http/response.js";
import {
  createPaymentSchema,
  getPaymentsQuerySchema,
} from "@repo/validators/payments";
import * as paymentsService from "./payments.service.js";

export const paymentRouter = new Hono()
  .get("/", zValidator("query", getPaymentsQuerySchema), async (c) => {
    const query = c.req.valid("query");
    const { items, meta } = await paymentsService.listPayments(query);
    return ApiResponse.paginated(c, items, meta);
  })

  .post("/", zValidator("json", createPaymentSchema), async (c) => {
    const data = c.req.valid("json");
    const payment = await paymentsService.createPayment(data);
    return ApiResponse.created(c, payment);
  });
