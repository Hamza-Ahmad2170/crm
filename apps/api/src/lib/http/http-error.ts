import type { ContentfulStatusCode } from "hono/utils/http-status";

export class HttpError extends Error {
  constructor(
    public readonly status: ContentfulStatusCode,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export class BadRequestError extends HttpError {
  constructor(
    message = "Bad request",
    code = "BAD_REQUEST",
    details?: unknown,
  ) {
    super(400, code, message, details);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized", code = "UNAUTHORIZED") {
    super(401, code, message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "Forbidden", code = "FORBIDDEN") {
    super(403, code, message);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Resource not found", code = "NOT_FOUND") {
    super(404, code, message);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends HttpError {
  constructor(message = "Resource already exists", code = "CONFLICT") {
    super(409, code, message);
    this.name = "ConflictError";
  }
}

export class ValidationError extends HttpError {
  constructor(details?: unknown, message = "Validation failed") {
    super(422, "VALIDATION_ERROR", message, details);
    this.name = "ValidationError";
  }
}
