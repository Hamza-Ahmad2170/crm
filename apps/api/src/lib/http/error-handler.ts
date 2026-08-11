import type { ErrorHandler, NotFoundHandler } from "hono";
import { HttpError } from "./http-error.js";

export type ErrorResponse = {
  success: false;
  error: {
    status: number;
    code: string;
    message: string;
    details?: unknown;
  };
};

const errorBody = (
  status: number,
  code: string,
  message: string,
  details?: unknown,
): ErrorResponse => ({
  success: false,
  error: {
    status,
    code,
    message,
    ...(details !== undefined ? { details } : {}),
  },
});

export const onError: ErrorHandler = (err, c) => {
  if (err instanceof HttpError) {
    return c.json(errorBody(err.status, err.code, err.message, err.details), err.status);
  }

  console.error(err);
  return c.json(errorBody(500, "INTERNAL_SERVER_ERROR", "Internal Server Error"), 500);
};

export const notFound: NotFoundHandler = (c) =>
  c.json(errorBody(404, "NOT_FOUND", `Route ${c.req.path} not found`), 404);
