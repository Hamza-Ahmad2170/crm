import { Hono } from "hono";
import { zValidator } from "@/lib/http/validators.js";
import { ApiResponse } from "@/lib/http/response.js";
import {
  createInvoiceSchema,
  cancelInvoiceSchema,
  getInvoicesQuerySchema,
  getInvoicesParamsSchema,
} from "@repo/validators/invoices";
import * as invoicesService from "./invoices.service.js";

export const invoiceRouter = new Hono()
  .get("/", zValidator("query", getInvoicesQuerySchema), async (c) => {
    const query = c.req.valid("query");
    const { items, meta } = await invoicesService.listInvoices(query);
    return ApiResponse.paginated(c, items, meta);
  })

  .get("/:id", zValidator("param", getInvoicesParamsSchema), async (c) => {
    const { id } = c.req.valid("param");
    const invoice = await invoicesService.getInvoiceById(id);
    return ApiResponse.success(c, invoice);
  })

  .post("/", zValidator("json", createInvoiceSchema), async (c) => {
    const data = c.req.valid("json");
    const invoice = await invoicesService.createInvoice(data);
    return ApiResponse.created(c, invoice);
  })

  .patch(
    "/:id/cancel",
    zValidator("param", getInvoicesParamsSchema),
    zValidator("json", cancelInvoiceSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const invoice = await invoicesService.cancelInvoice(id);
      return ApiResponse.success(c, invoice);
    },
  );
