// apps/api/src/lib/pagination.ts

export function getPaginationMeta(
  limit: number,
  offset: number,
  totalItems: number,
) {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    limit,
    offset,
    totalItems,
    currentPage: totalItems === 0 ? 0 : Math.floor(offset / limit) + 1,
    totalPages,
    hasNextPage: offset + limit < totalItems,
    hasPreviousPage: offset > 0,
  };
}
