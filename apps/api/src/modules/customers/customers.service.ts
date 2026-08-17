import { eq, and, or, ilike, isNull, sql, asc, desc } from "drizzle-orm";
import { db } from "@/db/index.js";
import { customers } from "@/db/schema/index.js";
import { getPaginationMeta } from "@/lib/pagination.js";
import { NotFoundError, ConflictError } from "@/lib/http/http-error.js";
import type {
  CreateCustomerInput,
  UpdateCustomerInput,
  GetCustomersQuery,
} from "@repo/validators/customers";

const sortableColumns = {
  name: customers.name,
  createdAt: customers.createdAt,
  status: customers.status,
} satisfies Record<
  GetCustomersQuery["sortBy"],
  typeof customers.name | typeof customers.createdAt | typeof customers.status
>;

export async function listCustomers(query: GetCustomersQuery) {
  const { limit, offset, sortBy, order, search, status } = query;
  const orderFn = order === "asc" ? asc : desc;
  const column = sortableColumns[sortBy];

  const conditions = [isNull(customers.deletedAt)];
  if (search) {
    conditions.push(
      or(
        ilike(customers.name, `%${search}%`),
        ilike(customers.phone, `%${search}%`),
      )!,
    );
  }
  if (status) {
    conditions.push(eq(customers.status, status));
  }
  const where = and(...conditions);

  const [items, count] = await Promise.all([
    db
      .select()
      .from(customers)
      .where(where)
      .orderBy(orderFn(column), orderFn(customers.id))
      .limit(limit)
      .offset(offset),
    db.$count(customers, where),
  ]);

  return { items, meta: getPaginationMeta(limit, offset, count) };
}

export async function getCustomerById(id: string) {
  const [customer] = await db
    .select()
    .from(customers)
    .where(and(eq(customers.id, id), isNull(customers.deletedAt)));

  if (!customer) throw new NotFoundError("Customer not found");
  return customer;
}

export async function createCustomer(data: CreateCustomerInput) {
  const [existing] = await db
    .select()
    .from(customers)
    .where(and(eq(customers.phone, data.phone), isNull(customers.deletedAt)));

  if (existing)
    throw new ConflictError("A customer with this phone number already exists");

  const [customer] = await db.insert(customers).values(data).returning();
  return customer;
}

export async function updateCustomer(id: string, data: UpdateCustomerInput) {
  const [updated] = await db
    .update(customers)
    .set(data)
    .where(and(eq(customers.id, id), isNull(customers.deletedAt)))
    .returning();

  if (!updated) {
    throw new NotFoundError("Customer not found");
  }

  return updated;
}

export async function deleteCustomer(id: string) {
  const [deleted] = await db
    .update(customers)
    .set({
      deletedAt: new Date(),
    })
    .where(and(eq(customers.id, id), isNull(customers.deletedAt)))
    .returning({
      id: customers.id,
    });

  if (!deleted) {
    throw new NotFoundError("Customer not found");
  }
}

export async function bulkDeleteCustomers(ids: string[]) {
  const deleted = await db
    .update(customers)
    .set({
      deletedAt: new Date(),
    })
    .where(and(sql`${customers.id} = ANY(${ids})`, isNull(customers.deletedAt)))
    .returning({
      id: customers.id,
    });

  return {
    requested: ids.length,
    deleted: deleted.length,
    deletedIds: deleted.map((customer) => customer.id),
  };
}
