import { eq, and, ilike, isNull, sql, asc, desc } from "drizzle-orm";
import { db } from "@/db/index.js";
import { plans, customers } from "@/db/schema/index.js";
import { getPaginationMeta } from "@/lib/pagination.js";
import { NotFoundError, ConflictError } from "@/lib/http/http-error.js";

import type {
  CreatePlanInput,
  UpdatePlanInput,
  GetPlansQuery,
} from "@repo/validators/plans";

const sortableColumns = {
  name: plans.name,
  price: plans.price,
  speedMbps: plans.speedMbps,
  createdAt: plans.createdAt,
} satisfies Record<
  GetPlansQuery["sortBy"],
  | typeof plans.name
  | typeof plans.price
  | typeof plans.speedMbps
  | typeof plans.createdAt
>;

export async function listPlans(query: GetPlansQuery) {
  const { limit, offset, sortBy, order, search, status } = query;
  const orderFn = order === "asc" ? asc : desc;
  const column = sortableColumns[sortBy];

  const conditions = [isNull(plans.deletedAt)];
  if (search) {
    conditions.push(ilike(plans.name, `%${search}%`));
  }
  if (status) {
    conditions.push(eq(plans.status, status));
  }
  const where = and(...conditions);

  const [items, count] = await Promise.all([
    db
      .select()
      .from(plans)
      .where(where)
      .orderBy(orderFn(column))
      .limit(limit)
      .offset(offset),
    db.$count(plans, where),
  ]);

  return { items, meta: getPaginationMeta(limit, offset, count) };
}

export async function getPlanById(id: string) {
  const plan = await db.query.plans.findFirst({
    where: {
      id,
    },
  });

  if (!plan) throw new NotFoundError("Plan not found");
  return plan;
}

export async function createPlan(data: CreatePlanInput) {
  const [existing] = await db
    .select()
    .from(plans)
    .where(and(eq(plans.name, data.name), isNull(plans.deletedAt)));

  if (existing) throw new ConflictError("A plan with this name already exists");

  const [plan] = await db.insert(plans).values(data).returning();
  return plan;
}

export async function updatePlan(id: string, data: UpdatePlanInput) {
  const [updated] = await db
    .update(plans)
    .set(data)
    .where(and(eq(plans.id, id), isNull(plans.deletedAt)))
    .returning();

  if (!updated) throw new NotFoundError("Plan not found");
  return updated;
}

export async function deletePlan(id: string) {
  const [inUse] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(customers)
    .where(and(eq(customers.planId, id), isNull(customers.deletedAt)));

  if (inUse.count > 0) {
    throw new ConflictError(
      `Cannot delete plan: ${inUse.count} customer(s) are currently assigned to it`,
    );
  }

  const [deleted] = await db
    .update(plans)
    .set({ deletedAt: new Date() })
    .where(and(eq(plans.id, id), isNull(plans.deletedAt)))
    .returning({ id: plans.id });

  if (!deleted) throw new NotFoundError("Plan not found");
}

export async function bulkDeletePlans(ids: string[]) {
  // find which of the requested plan ids currently have active customers on them
  const inUseRows = await db
    .selectDistinct({ planId: customers.planId })
    .from(customers)
    .where(
      and(sql`${customers.planId} = ANY(${ids})`, isNull(customers.deletedAt)),
    );

  const inUseIds = new Set(inUseRows.map((r) => r.planId));
  const deletableIds = ids.filter((id) => !inUseIds.has(id));

  const deleted = deletableIds.length
    ? await db
        .update(plans)
        .set({ deletedAt: new Date() })
        .where(
          and(sql`${plans.id} = ANY(${deletableIds})`, isNull(plans.deletedAt)),
        )
        .returning({ id: plans.id })
    : [];

  return {
    requested: ids.length,
    deleted: deleted.length,
    deletedIds: deleted.map((d) => d.id),
    skippedInUse: Array.from(inUseIds), // plans that were requested but skipped because customers reference them
  };
}
