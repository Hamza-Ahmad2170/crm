import type { Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronsUpDown } from '#/components/icons.tsx'

import { cn } from '#/lib/utils.ts'

/**
 * Sortable column header. Drop it into a column's `header` once server-side
 * sorting is enabled (see the TODO block in `hooks/use-data-table.ts`).
 *
 * Currently inert: `manualSorting` is set and no `onSortingChange` is wired,
 * so clicking won't change the data until sort is enabled.
 *
 * @example
 * header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />
 */
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: {
  column: Column<TData, TValue>
  title: string
  className?: string
}) {
  const sorted = column.getIsSorted()

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-80',
        className,
      )}
      onClick={() => column.toggleSorting(undefined)}
    >
      {title}
      {sorted === 'asc' ? (
        <ArrowUp className="size-3.5" />
      ) : sorted === 'desc' ? (
        <ArrowDown className="size-3.5" />
      ) : (
        <ChevronsUpDown className="size-3.5 opacity-50" />
      )}
    </button>
  )
}
