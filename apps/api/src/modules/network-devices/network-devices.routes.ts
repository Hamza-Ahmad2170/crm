import { Hono } from "hono";
import { zValidator } from "@/lib/http/validators.js";
import { ApiResponse } from "@/lib/http/response.js";
import { idParamSchema } from "@repo/validators/common";
import {
  createDeviceSchema,
  updateDeviceSchema,
  getDevicesQuerySchema,
} from "@repo/validators/network-devices";
import * as devicesService from "./network-devices.service.js";

export const networkDeviceRouter = new Hono()
  .get("/", zValidator("query", getDevicesQuerySchema), async (c) => {
    const query = c.req.valid("query");
    const { items, meta } = await devicesService.listDevices(query);
    return ApiResponse.paginated(c, items, meta);
  })

  .get("/:id", zValidator("param", idParamSchema), async (c) => {
    const { id } = c.req.valid("param");
    const device = await devicesService.getDeviceById(id);
    return ApiResponse.success(c, device);
  })

  .post("/", zValidator("json", createDeviceSchema), async (c) => {
    const data = c.req.valid("json");
    const device = await devicesService.createDevice(data);
    return ApiResponse.created(c, device);
  })

  .patch(
    "/:id",
    zValidator("param", idParamSchema),
    zValidator("json", updateDeviceSchema),
    async (c) => {
      const { id } = c.req.valid("param");
      const data = c.req.valid("json");
      const device = await devicesService.updateDevice(id, data);
      return ApiResponse.success(c, device);
    },
  )

  .delete("/:id", zValidator("param", idParamSchema), async (c) => {
    const { id } = c.req.valid("param");
    await devicesService.deleteDevice(id);
    return ApiResponse.noContent(c);
  });
