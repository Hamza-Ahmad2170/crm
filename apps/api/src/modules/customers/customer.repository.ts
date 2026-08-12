import {
  and,
  eq,
  isNull,
  sql,
  or,
  ilike,
  inArray,
  asc,
  desc,
} from "drizzle-orm";

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
  search,
  status,
  sortBy,
  sortDirection,
}: CustomerListSchema) {
  const conditions = [isNull(customers.deletedAt)];

  if (search) {
    conditions.push(
      or(
        ilike(customers.name, `%${search}%`),
        ilike(customers.phone, `%${search}%`),
      )!,
    );
  }

  if (status?.length) {
    conditions.push(inArray(customers.status, status));
  }

  const where = and(...conditions);

  const [rows, [{ count }]] = await Promise.all([
    db
      .select()
      .from(customers)
      .where(where)
      .orderBy(getCustomerOrderBy(sortBy, sortDirection))
      .limit(limit)
      .offset(offset),

    db
      .select({
        count: sql<number>`count(*)::int`,
      })
      .from(customers)
      .where(where),
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

function getCustomerOrderBy(
  sortBy: CustomerListSchema["sortBy"],
  sortDirection: CustomerListSchema["sortDirection"],
) {
  const column = {
    name: customers.name,
    createdAt: customers.createdAt,
    status: customers.status,
    phone: customers.phone,
  }[sortBy];

  return sortDirection === "asc" ? asc(column) : desc(column);
}
