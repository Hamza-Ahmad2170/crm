import { eq, and, or, ilike, isNull, sql, asc, desc } from "drizzle-orm";
import { db } from "@/db/index.js";
import { plans } from "@/db/schema/plans.js";
import { getPaginationMeta } from "@/lib/pagination.js";
import { NotFoundError, ConflictError } from "@/lib/http/http-error.js";

import type {
  CreatePlanInput,
  UpdatePlanInput,
  GetPlansQuery,
} from "@repo/validators/plans";

const sortableColumns = {
  name: plans.name,
  price: plans.price,
  speedMbps: plans.speedMbps,
  createdAt: plans.createdAt,
} satisfies Record<
  GetPlansQuery["sortBy"],
  | typeof plans.name
  | typeof plans.price
  | typeof plans.speedMbps
  | typeof plans.createdAt
>;
