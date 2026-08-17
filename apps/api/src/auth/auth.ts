import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/index.js";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true, // blocks public sign-up — accounts only created via admin.createUser
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
  },
  plugins: [
    admin({
      defaultRole: "support", // any account not explicitly given a role lands here
      adminRoles: ["admin"], // which role value(s) count as "admin" for the plugin's own checks
    }),
  ],
});

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};
