import { eq, asc } from "drizzle-orm";
import { db } from "@/db/index.js";
import { ticketComments } from "@/db/schema/index.js";
import { getTicketById } from "./tickets.service.js";
import type { CreateTicketCommentInput } from "@repo/validators/tickets";

export async function listTicketComments(ticketId: string) {
  await getTicketById(ticketId); // 404s if the parent ticket doesn't exist
  return db
    .select()
    .from(ticketComments)
    .where(eq(ticketComments.ticketId, ticketId))
    .orderBy(asc(ticketComments.createdAt));
}

export async function createTicketComment(
  ticketId: string,
  data: CreateTicketCommentInput,
  authorId?: string,
) {
  await getTicketById(ticketId);
  const [comment] = await db
    .insert(ticketComments)
    .values({ ticketId, authorId, ...data })
    .returning();
  return comment;
}
