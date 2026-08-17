import { Hono } from "hono";
import { zValidator } from "@/lib/http/validators.js";
import { ApiResponse } from "@/lib/http/response.js";
import { requireRole } from "@/auth/session-middleware.js";
import { STAFF_ROLE } from "@repo/validators/enums";
import { auth } from "@/auth/auth.js";
import z from "zod";

const createStaffSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8),
  role: z.enum(STAFF_ROLE),
});

export const staffRouter = new Hono()
  .use("*", requireRole("admin")) // only admins can create staff accounts
  .post("/", zValidator("json", createStaffSchema), async (c) => {
    const { name, email, password, role } = c.req.valid("json");

    const result = await auth.api.createUser({
      body: { name, email, password, role },
    });

    return ApiResponse.created(c, result.user);
  });
