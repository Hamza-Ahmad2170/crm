import { faker } from "@faker-js/faker";
import { db } from "@/db/index.js";
import { customers, type NewCustomer } from "@/db/schema/customers.js";

const SEED_COUNT = 50;
// Pakistani phone number generator
export function generatePhone(): string {
  const prefix = faker.helpers.arrayElement([
    "0300",
    "0321",
    "0333",
    "0345",
    "0312",
    "0301",
    "0302",
    "0303",
    "0304",
    "0305",
  ]);
  return `${prefix}-${faker.string.numeric({ length: 7 })}`;
}

// Status values from your enum
const statusValues = ["active", "inactive", "suspended"] as const;
type StatusType = (typeof statusValues)[number];

// Pakistani CNIC generator
export function generateCNIC(): string {
  const digits = faker.string.numeric({ length: 13 });
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
}

function generateCustomer(index: number): typeof customers.$inferInsert {
  const status = faker.helpers.arrayElement(statusValues) as StatusType;

  return {
    name: faker.person.fullName(),
    phone: generatePhone(),
    cnic: faker.datatype.boolean(0.7) ? generateCNIC() : null, // 70% chance of having CNIC
    address: faker.location.streetAddress({ useFullAddress: true }),
    status: status,
    // createdAt, updatedAt will be handled by defaults
    deletedAt: status === "suspended" ? faker.date.recent({ days: 30 }) : null,
  };
}

async function seedCustomers() {
  console.log(`🌱 Seeding ${SEED_COUNT} customers...`);

  // Optional: Clear existing data (uncomment if needed)
  // await db.delete(customers);

  const customersData: NewCustomer[] = Array.from(
    { length: SEED_COUNT },
    (_, i) => generateCustomer(i),
  );

  // Insert all customers
  const inserted = await db.insert(customers).values(customersData).returning();

  console.log(`✅ Successfully seeded ${inserted.length} customers!`);

  // Display some sample data
  console.log("\n📊 Sample customers:");
  inserted.slice(0, 5).forEach((customer, index) => {
    console.log(
      `${index + 1}. ${customer.name} (${customer.status}) - ${customer.phone}`,
    );
  });

  // Statistics
  const statusCounts = inserted.reduce((acc: Record<string, number>, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});

  console.log("\n📈 Status distribution:");
  Object.entries(statusCounts).forEach(([status, count]) => {
    console.log(
      `  ${status}: ${count} (${((count / inserted.length) * 100).toFixed(1)}%)`,
    );
  });

  const withCNIC = inserted.filter((c) => c.cnic).length;
  console.log(
    `\n📋 ${withCNIC} (${((withCNIC / inserted.length) * 100).toFixed(1)}%) have CNIC`,
  );
}

export { seedCustomers };
