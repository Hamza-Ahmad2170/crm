import { seedCustomers } from "./customer.js";

async function seed() {
  console.log("🌱 Seeding database...");

  await seedCustomers();

  console.log("🌱 Database seeded");
}

seed().catch(console.error);
