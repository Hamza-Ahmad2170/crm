import { eq, and, ilike, sql, asc, desc } from "drizzle-orm";
import { db } from "@/db/index.js";
import { areas, customers } from "@/db/schema/index.js";
import { getPaginationMeta } from "@/lib/pagination.js";
import { ConflictError, NotFoundError } from "@/lib/http/http-error.js";

import type {
  CreateAreaInput,
  UpdateAreaInput,
  GetAreasQuery,
} from "@repo/validators/areas";

const sortableColumns = {
  name: areas.name,
  createdAt: areas.createdAt,
} satisfies Record<
  GetAreasQuery["sortBy"],
  typeof areas.name | typeof areas.createdAt
>;

export async function listAreas(query: GetAreasQuery) {
  const { limit, offset, sortBy, order, search } = query;
  const orderFn = order === "asc" ? asc : desc;
  const column = sortableColumns[sortBy];

  const where = search ? ilike(areas.name, `%${search}%`) : undefined;

  const [items, [{ count }]] = await Promise.all([
    db
      .select()
      .from(areas)
      .where(where)
      .orderBy(orderFn(column))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(areas)
      .where(where),
  ]);

  return { items, meta: getPaginationMeta(limit, offset, count) };
}

export async function getAreaById(id: string) {
  const area = await db.query.areas.findFirst({
    where: {
      id,
    },
  });

  if (!area) throw new NotFoundError("Area not found");
  return area;
}

export async function createArea(data: CreateAreaInput) {
  const existing = await db.query.areas.findFirst({
    where: {
      name: data.name,
    },
  });

  if (existing)
    throw new ConflictError("An area with this name already exists");

  const [area] = await db.insert(areas).values(data).returning();
  return area;
}

export async function updateArea(id: string, data: UpdateAreaInput) {
  const [updated] = await db
    .update(areas)
    .set(data)
    .where(eq(areas.id, id))
    .returning();
  if (!updated) throw new NotFoundError("Area not found");
  return updated;
}

export async function deleteArea(id: string) {
  const [inUse] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(customers)
    .where(and(eq(customers.areaId, id), sql`${customers.deletedAt} IS NULL`));

  if (inUse.count > 0) {
    throw new ConflictError(
      `Cannot delete area: ${inUse.count} customer(s) are assigned to it`,
    );
  }

  const [deleted] = await db
    .delete(areas)
    .where(eq(areas.id, id))
    .returning({ id: areas.id });
  if (!deleted) throw new NotFoundError("Area not found");
}

export async function bulkDeleteAreas(ids: string[]) {
  const inUseRows = await db
    .selectDistinct({ areaId: customers.areaId })
    .from(customers)
    .where(
      and(
        sql`${customers.areaId} = ANY(${ids})`,
        sql`${customers.deletedAt} IS NULL`,
      ),
    );

  const inUseIds = new Set(inUseRows.map((r) => r.areaId));
  const deletableIds = ids.filter((id) => !inUseIds.has(id));

  const deleted = deletableIds.length
    ? await db
        .delete(areas)
        .where(sql`${areas.id} = ANY(${deletableIds})`)
        .returning({ id: areas.id })
    : [];

  return {
    requested: ids.length,
    deleted: deleted.length,
    deletedIds: deleted.map((d) => d.id),
    skippedInUse: Array.from(inUseIds),
  };
}
