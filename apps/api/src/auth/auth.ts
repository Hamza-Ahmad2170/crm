import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/index.js";
import { admin } from "better-auth/plugins";
import {
  ac,
  admin as adminRole,
  support,
  technician,
  accountant,
} from "./permissions.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
  },
  plugins: [
    admin({
      defaultRole: "support",
      ac,
      roles: {
        admin: adminRole,
        support,
        technician,
        accountant,
      },
    }),
  ],
});
export type AuthType = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};
