import { Hono } from "hono";
import { zValidator } from "@/lib/http/validators.js";
import { ApiResponse } from "@/lib/http/response.js";
import {
  createTicketCommentSchema,
  getTicketCommentsParamsSchema,
} from "@repo/validators/tickets";
import * as commentsService from "./ticket-comments.service.js";

export const ticketCommentRouter = new Hono()
  .get(
    "/:id/comments",
    zValidator("param", getTicketCommentsParamsSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const comments = await commentsService.listTicketComments(id);
      return ApiResponse.success(c, comments);
    },
  )

  .post(
    "/:id/comments",
    zValidator("param", getTicketCommentsParamsSchema),
    zValidator("json", createTicketCommentSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const data = c.req.valid("json");
      // authorId comes from auth context once Better Auth is wired in — hardcode/omit for now
      const comment = await commentsService.createTicketComment(id, data);
      return ApiResponse.created(c, comment);
    },
  );
