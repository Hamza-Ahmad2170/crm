import type { SortingState } from '@tanstack/react-table'
import { z } from 'zod'

const sortItemSchema = z.object({
  id: z.string(),
  desc: z.boolean(),
})

/**
 * Parse a TanStack Table `SortingState` that was serialized to JSON in the URL.
 * Entries whose `id` isn't in `validIds` are dropped — protects against stale
 * sort params for columns that no longer exist.
 *
 * (Ready for when server-side sorting is enabled; not wired yet.)
 */
export function parseSortingState(
  value: string | undefined,
  validIds: Set<string>,
): SortingState {
  if (!value) return []
  try {
    const parsed = sortItemSchema.array().parse(JSON.parse(value))
    return parsed.filter((item) => validIds.has(item.id))
  } catch {
    return []
  }
}

/** Serialize a `SortingState` to a compact JSON string for the URL. */
export function serializeSortingState(state: SortingState): string {
  return JSON.stringify(state.map(({ id, desc }) => ({ id, desc })))
}
