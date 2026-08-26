import { auth } from "@/auth/auth.js";
import { db } from "@/db/index.js";
import { user } from "@/db/schema/user.js";
import { eq } from "drizzle-orm";

export async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL || "hamza@example.com";
  const password = process.env.SEED_ADMIN_PASSWORD || "password";

  if (!email || !password) {
    throw new Error(
      "SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in .env before seeding an admin",
    );
  }

  const [existing] = await db.select().from(user).where(eq(user.email, email));
  if (existing) {
    console.log(`⚠️  Admin already exists for ${email}, skipping`);
    return;
  }

  await auth.api.createUser({
    body: {
      name: "Hamza",
      email,
      password,
      role: "admin",
    },
  });

  console.log(`✅ Admin account created for ${email}`);
}
