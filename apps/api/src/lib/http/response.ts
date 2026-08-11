import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export interface PaginationMeta {
  limit: number;
  offset: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export class ApiResponse {
  private constructor() {}

  static success<T>(c: Context, data: T, status: ContentfulStatusCode = 200) {
    return c.json(data, status);
  }

  static created<T>(c: Context, data: T) {
    return c.json(data, 201);
  }

  static noContent(c: Context) {
    return c.body(null, 204);
  }

  static paginated<T>(c: Context, items: T[], meta: PaginationMeta) {
    return c.json({ items, meta });
  }
}
