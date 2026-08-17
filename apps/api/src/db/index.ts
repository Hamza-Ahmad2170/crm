import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { relations } from "./relations.js";
import { env } from "@/config/env.js";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle({ client: pool, relations });
export type DbOrTx =
  | typeof db
  | Parameters<Parameters<typeof db.transaction>[0]>[0];
