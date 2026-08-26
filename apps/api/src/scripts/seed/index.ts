import { seedCustomers } from "./customer.js";
import { seedAdmin } from "./admin.js";

async function seed() {
  console.log("🌱 Seeding database...");

  await seedAdmin();
  await seedCustomers();

  console.log("🌱 Database seeded");
}

seed().catch(console.error);
