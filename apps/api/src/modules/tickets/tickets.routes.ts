import { Hono } from "hono";
import { zValidator } from "@/lib/http/validators.js";
import { ApiResponse } from "@/lib/http/response.js";
import {
  createTicketSchema,
  updateTicketSchema,
  updateTicketStatusSchema,
  getTicketsQuerySchema,
  getTicketParamsSchema,
} from "@repo/validators/tickets";
import * as ticketsService from "./tickets.service.js";

export const ticketRouter = new Hono()
  .get("/", zValidator("query", getTicketsQuerySchema), async (c) => {
    const query = c.req.valid("query");
    const { items, meta } = await ticketsService.listTickets(query);
    return ApiResponse.paginated(c, items, meta);
  })
  .get("/:id", zValidator("param", getTicketParamsSchema), async (c) => {
    const { id } = c.req.valid("param");
    const ticket = await ticketsService.getTicketById(id);
    return ApiResponse.success(c, ticket);
  })

  .post("/", zValidator("json", createTicketSchema), async (c) => {
    const data = c.req.valid("json");
    const ticket = await ticketsService.createTicket(data);
    return ApiResponse.created(c, ticket);
  })
  .patch(
    "/:id",
    zValidator("param", getTicketParamsSchema),
    zValidator("json", updateTicketSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const data = c.req.valid("json");
      const ticket = await ticketsService.updateTicket(id, data);
      return ApiResponse.success(c, ticket);
    },
  )
  .patch(
    "/:id/status",
    zValidator("param", getTicketParamsSchema),
    zValidator("json", updateTicketStatusSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const { status } = c.req.valid("json");
      const ticket = await ticketsService.updateTicketStatus(id, status);
      return ApiResponse.success(c, ticket);
    },
  )

  .route("/", ticketCommentRouter);
