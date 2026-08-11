import { and, eq, isNull, sql } from "drizzle-orm";

import { db } from "@/db/index.js";
import { customers } from "@/db/schema/customers.js";
import type { CustomerListSchema } from "@repo/schema";

export async function createCustomer(data: typeof customers.$inferInsert) {
  const [customer] = await db.insert(customers).values(data).returning();

  return customer;
}

export async function listCustomers({
  limit,
  offset,
}: CustomerListSchema) {
  const [rows, [{ count }]] = await Promise.all([
    db
      .select()
      .from(customers)
      .where(isNull(customers.deletedAt))
      .orderBy(customers.id)
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(customers)
      .where(isNull(customers.deletedAt)),
  ]);

  return {
    rows,
    count,
  };
}

export async function findCustomerById(id: string) {
  const [customer] = await db
    .select()
    .from(customers)
    .where(and(eq(customers.id, id), isNull(customers.deletedAt)));

  return customer;
}

export async function updateCustomer(
  id: string,
  data: Partial<typeof customers.$inferInsert>,
) {
  const [customer] = await db
    .update(customers)
    .set(data)
    .where(and(eq(customers.id, id), isNull(customers.deletedAt)))
    .returning();

  return customer;
}

export async function deleteCustomer(id: string) {
  const [customer] = await db
    .delete(customers)
    .where(and(eq(customers.id, id), isNull(customers.deletedAt)))
    .returning();

  return customer;
}
