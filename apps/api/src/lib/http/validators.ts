import type * as z from "zod";
import type { ValidationTargets } from "hono";
import { zValidator as zv } from "@hono/zod-validator";
import { ValidationError } from "./http-error.js";

export const zValidator = <
  T extends z.ZodSchema,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: T,
  message = "Validation failed",
) =>
  zv(target, schema, (result) => {
    if (!result.success) {
      throw new ValidationError(result.error.issues, message);
    }
  });
