import { createMiddleware } from "hono/factory";
import { auth } from "./auth.js";
import { UnauthorizedError, ForbiddenError } from "@/lib/http/http-error.js";
import type { StaffRole } from "@repo/validators/enums";

type AuthEnv = {
  Variables: {
    user: (typeof auth.$Infer.Session.user & { role: StaffRole }) | null;
    session: typeof auth.$Infer.Session.session | null;
  };
};

export const requireAuth = createMiddleware<AuthEnv>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) throw new UnauthorizedError();

  c.set("user", session.user as AuthEnv["Variables"]["user"]);
  c.set("session", session.session);
  return next();
});

export function requireRole(...roles: StaffRole[]) {
  return createMiddleware<AuthEnv>(async (c, next) => {
    const user = c.get("user");
    if (!user) throw new UnauthorizedError();
    if (!roles.includes(user.role)) throw new ForbiddenError();
    return next();
  });
}
