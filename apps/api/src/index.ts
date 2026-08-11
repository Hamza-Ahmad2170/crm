import "dotenv/config";

import { Hono } from "hono";
import type { ApplyGlobalResponse } from "hono/client";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";

import { auth } from "@/auth/auth.js";
import type { ErrorResponse } from "@/lib/http/error-handler.js";
import { onError, notFound } from "@/lib/http/error-handler.js";
import { customerRouter } from "@/modules/customers/customer.routes.js";

const app = new Hono().basePath("/api/v1");

app.use(logger());
app.use(cors());
app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

const routes = app.route("/customers", customerRouter);

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
  },
);
