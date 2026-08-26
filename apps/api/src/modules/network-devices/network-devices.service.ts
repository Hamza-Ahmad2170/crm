import { eq, and, sql, asc, desc } from "drizzle-orm";
import { db } from "@/db/index.js";
import { networkDevices } from "@/db/schema/index.js";
import { getPaginationMeta } from "@/lib/pagination.js";
import { NotFoundError } from "@/lib/http/http-error.js";
import type {
  CreateDeviceInput,
  UpdateDeviceInput,
  GetDevicesQuery,
} from "@repo/validators/network-devices";

type DeviceSortColumn = Record<
  GetDevicesQuery["sortBy"],
  | typeof networkDevices.createdAt
  | typeof networkDevices.type
  | typeof networkDevices.status
>;

const sortableColumns: DeviceSortColumn = {
  createdAt: networkDevices.createdAt,
  type: networkDevices.type,
  status: networkDevices.status,
};

export async function listDevices(query: GetDevicesQuery) {
  const { limit, offset, sortBy, order, type, status, customerId } = query;
  const orderFn = order === "asc" ? asc : desc;
  const column = sortableColumns[sortBy];

  const conditions = [];
  if (type) conditions.push(eq(networkDevices.type, type));
  if (status) conditions.push(eq(networkDevices.status, status));
  if (customerId) conditions.push(eq(networkDevices.customerId, customerId));
  const where = conditions.length ? and(...conditions) : undefined;

  const [items, totalItems] = await Promise.all([
    db
      .select()
      .from(networkDevices)
      .where(where)
      .orderBy(orderFn(column), asc(networkDevices.id))
      .limit(limit)
      .offset(offset),
    db.$count(networkDevices, where),
  ]);

  return { items, meta: getPaginationMeta(limit, offset, totalItems) };
}

export async function getDeviceById(id: string) {
  const device = await db.query.networkDevices.findFirst({ where: { id } });
  if (!device) throw new NotFoundError("Device not found");
  return device;
}

export async function createDevice(data: CreateDeviceInput) {
  const [device] = await db.insert(networkDevices).values(data).returning();
  return device;
}

export async function updateDevice(id: string, data: UpdateDeviceInput) {
  const [updated] = await db
    .update(networkDevices)
    .set(data)
    .where(eq(networkDevices.id, id))
    .returning();

  if (!updated) throw new NotFoundError("Device not found");
  return updated;
}

export async function deleteDevice(id: string) {
  const [deleted] = await db
    .delete(networkDevices)
    .where(eq(networkDevices.id, id))
    .returning({ id: networkDevices.id });

  if (!deleted) throw new NotFoundError("Device not found");
}
