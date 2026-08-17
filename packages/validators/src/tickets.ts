import { z } from "zod";
import {
  paginationQuerySchema,
  searchQuerySchema,
  createSortQuerySchema,
  idParamSchema,
} from "./common.js";
import { TICKET_STATUS, TICKET_PRIORITY } from "./enums.js";

const ticketBaseFields = {
  customerId: z.uuid(),
  subject: z.string().min(1, "Subject is required").max(255),
  description: z.string().max(2000).optional(),
  priority: z.enum(TICKET_PRIORITY).default("medium"),
};

export const createTicketSchema = z.object(ticketBaseFields);
export type CreateTicketInput = z.infer<typeof createTicketSchema>;

// general update — everything except status
export const updateTicketSchema = z
  .object({
    subject: ticketBaseFields.subject,
    description: ticketBaseFields.description,
    priority: ticketBaseFields.priority,
    assignedTo: z.string().uuid().nullable(),
  })
  .partial();
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;

// dedicated status transition
export const updateTicketStatusSchema = z.object({
  status: z.enum(TICKET_STATUS),
});
export type UpdateTicketStatusInput = z.infer<typeof updateTicketStatusSchema>;

const TICKET_SORT_FIELDS = ["createdAt", "priority", "status"] as const;
const ticketSortQuerySchema = createSortQuerySchema(
  TICKET_SORT_FIELDS,
  "createdAt",
);

export const getTicketsQuerySchema = paginationQuerySchema
  .merge(ticketSortQuerySchema)
  .merge(searchQuerySchema)
  .extend({
    status: z.enum(TICKET_STATUS).optional(),
    priority: z.enum(TICKET_PRIORITY).optional(),
    customerId: z.uuid().optional(),
    assignedTo: z.uuid().optional(),
  });
export type GetTicketsQuery = z.infer<typeof getTicketsQuerySchema>;

export const ticketSchema = z.object({
  id: z.uuid(),
  ...ticketBaseFields,
  assignedTo: z.string().uuid().nullable(),
  status: z.enum(TICKET_STATUS),
  createdAt: z.string(),
  updatedAt: z.string(),
  resolvedAt: z.string().nullable(),
});
export type Ticket = z.infer<typeof ticketSchema>;

// --- ticket comments (nested resource) ---
export const createTicketCommentSchema = z.object({
  body: z.string().min(1, "Comment cannot be empty").max(2000),
});
export type CreateTicketCommentInput = z.infer<
  typeof createTicketCommentSchema
>;

export const ticketCommentSchema = z.object({
  id: z.uuid(),
  ticketId: z.uuid(),
  authorId: z.uuid().nullable(),
  body: z.string(),
  createdAt: z.string(),
});

export const getTicketParamsSchema = idParamSchema;
export const getTicketCommentsParamsSchema = idParamSchema;
export type TicketComment = z.infer<typeof ticketCommentSchema>;
