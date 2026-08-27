import "dotenv/config";

import { Hono } from "hono";
import type { ApplyGlobalResponse } from "hono/client";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";

import { auth } from "@/auth/auth.js";
import { env } from "@/config/env.js";
import type { ErrorResponse } from "@/lib/http/error-handler.js";
import { onError, notFound } from "@/lib/http/error-handler.js";
import { customerRouter } from "@/modules/customers/customer.routes.js";
import { planRouter } from "@/modules/plans/plans.routes.js";
import { staffRouter } from "@/modules/staff/staff.routes.js";
import { invoiceRouter } from "@/modules/invoices/invoices.routes.js";
import { ticketRouter } from "@/modules/tickets/tickets.routes.js";
import { paymentRouter } from "@/modules/payments/payments.routes.js";
import { areaRouter } from "@/modules/areas/areas.routes.js";
import { startOverdueInvoiceJob } from "./jobs/mark-overdue-invoices.job.js";

const app = new Hono();

app.use(logger());
app.use(
  "/api/*",
  cors({
    origin: env.WEB_ORIGIN,
    credentials: true,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);
app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

const routes = app
  .basePath("/api/v1")
  // .use("*", requireAuth)
  .route("/customers", customerRouter)
  .route("/plans", planRouter)
  .route("/areas", areaRouter)
  .route("/invoices", invoiceRouter)
  .route("/payments", paymentRouter)
  .route("/tickets", ticketRouter)
  .route("/staff", staffRouter);

app.onError(onError);
app.notFound(notFound);

type ApiError = { json: ErrorResponse };

export type AppType = ApplyGlobalResponse<
  typeof routes,
  {
    400: ApiError;
    401: ApiError;
    403: ApiError;
    404: ApiError;
    409: ApiError;
    422: ApiError;
    500: ApiError;
  }
>;

serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`API running on http://localhost:${info.port}`);
    startOverdueInvoiceJob();
  },
);
