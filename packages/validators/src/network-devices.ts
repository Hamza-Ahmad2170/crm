import { z } from "zod";
import { paginationQuerySchema, createSortQuerySchema } from "./common.js";
import { DEVICE_TYPE, DEVICE_STATUS } from "./enums.js";

const IPV4_OR_IPV6_REGEX =
  /^(\d{1,3}\.){3}\d{1,3}$|^([\da-fA-F]{0,4}:){2,7}[\da-fA-F]{0,4}$/;
const MAC_ADDRESS_REGEX = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/;

const deviceBaseFields = {
  customerId: z.uuid().optional(),
  type: z.enum(DEVICE_TYPE),
  ipAddress: z
    .string()
    .regex(IPV4_OR_IPV6_REGEX, "Invalid IP address")
    .optional(),
  macAddress: z
    .string()
    .regex(
      MAC_ADDRESS_REGEX,
      "Invalid MAC address (expected AA:BB:CC:DD:EE:FF)",
    )
    .optional(),
  serialNumber: z.string().max(100).optional(),
};

export const createDeviceSchema = z.object(deviceBaseFields);
export type CreateDeviceInput = z.infer<typeof createDeviceSchema>;

export const updateDeviceSchema = z
  .object({
    ...deviceBaseFields,
    status: z.enum(DEVICE_STATUS),
  })
  .partial();
export type UpdateDeviceInput = z.infer<typeof updateDeviceSchema>;

const DEVICE_SORT_FIELDS = ["createdAt", "type", "status"] as const;
const deviceSortQuerySchema = createSortQuerySchema(
  DEVICE_SORT_FIELDS,
  "createdAt",
);

export const getDevicesQuerySchema = paginationQuerySchema
  .merge(deviceSortQuerySchema)
  .extend({
    type: z.enum(DEVICE_TYPE).optional(),
    status: z.enum(DEVICE_STATUS).optional(),
    customerId: z.uuid().optional(),
  });
export type GetDevicesQuery = z.infer<typeof getDevicesQuerySchema>;

export const deviceSchema = z.object({
  id: z.uuid(),
  ...deviceBaseFields,
  status: z.enum(DEVICE_STATUS),
  createdAt: z.string(),
});
export type Device = z.infer<typeof deviceSchema>;
