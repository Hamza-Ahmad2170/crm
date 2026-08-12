import {
  type ColumnDef,
  type ColumnPinningState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type Updater,
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useNavigate, useSearch } from '@tanstack/react-router'
import * as React from 'react'

const DEFAULT_PAGE_SIZE = 20

type UseDataTableProps<TData> = {
  data: TData[]
  columns: ColumnDef<TData>[]
  /** Total pages from the server (manual pagination). */
  pageCount: number
  initialState?: {
    pagination?: { pageSize: number }
    columnPinning?: ColumnPinningState
  }
}

/**
 * Generic, URL-driven data-table hook.
 *
 * **Pagination** (`limit` / `offset`) and **sorting** (`sortBy` +
 * `sortDirection`) are server-side and fully wired — they live in the URL and
 * the server does the work. **Filtering** is server-side too but not wired yet
 * (see the marked block).
 */
export function useDataTable<TData>({
  data,
  columns,
  pageCount,
  initialState,
}: UseDataTableProps<TData>) {
  const search = useSearch({ strict: false }) as Record<string, unknown>
  // `useNavigate` is route-generic here, so cast to a permissive signature to
  // avoid leaking route-specific search types into this shared hook.
  const navigate = useNavigate() as (opts: {
    search: (prev: Record<string, unknown>) => Record<string, unknown>
    replace?: boolean
  }) => Promise<void>

  // --- PAGINATION (derived from the URL: limit/offset, matching the backend) ---
  const limit =
    Number(search.limit ?? initialState?.pagination?.pageSize ?? DEFAULT_PAGE_SIZE) ||
    DEFAULT_PAGE_SIZE
  const offset = Number(search.offset ?? 0) || 0
  const pagination = React.useMemo<PaginationState>(
    () => ({ pageIndex: limit > 0 ? Math.floor(offset / limit) : 0, pageSize: limit }),
    [limit, offset],
  )

  const onPaginationChange = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      const next =
        typeof updaterOrValue === 'function' ? updaterOrValue(pagination) : updaterOrValue
      void navigate({
        search: (prev) => ({
          ...prev,
          limit: next.pageSize,
          offset: next.pageIndex * next.pageSize,
        }),
        replace: true,
      })
    },
    [pagination, navigate],
  )

  // --- SORTING (derived from the URL: sortBy + sortDirection) ---
  // Single-column sort — the backend takes one `sortBy` + `asc`/`desc`.
  const sortBy = search.sortBy as string | undefined
  const sortDirection = search.sortDirection as 'asc' | 'desc' | undefined
  const sorting = React.useMemo<SortingState>(
    () => (sortBy ? [{ id: sortBy, desc: sortDirection === 'desc' }] : []),
    [sortBy, sortDirection],
  )

  const onSortingChange = React.useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      const next =
        typeof updaterOrValue === 'function' ? updaterOrValue(sorting) : updaterOrValue
      const first = next[0]
      void navigate({
        search: (prev) => ({
          ...prev,
          // reset to the API default (createdAt desc) when sorting is cleared
          sortBy: first?.id ?? 'createdAt',
          sortDirection: first ? (first.desc ? 'desc' : 'asc') : 'desc',
        }),
        replace: true,
      })
    },
    [sorting, navigate],
  )

  // --- LOCAL-ONLY UI STATE (not URL-synced) ---
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>(
    initialState?.columnPinning ?? {},
  )

  const table = useReactTable<TData>({
    data,
    columns,
    pageCount, // server-provided total page count
    state: { pagination, sorting, rowSelection, columnVisibility, columnPinning },
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    onPaginationChange,
    onSortingChange,
    manualPagination: true,
    manualSorting: true,

    // Row models retained so derived selectors (row counts in the pagination
    // bar, sorting indicators, etc.) keep working even though pagination/sort
    // are manual.
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),

    // -----------------------------------------------------------------
    // SERVER-SIDE FILTER (still pending)
    // -----------------------------------------------------------------
    // The backend supports `search` + `status`. To wire filtering:
    //   1. Read them from the URL (like limit/offset/sortBy above).
    //   2. Add `columnFilters` to the `state` object and an
    //      `onColumnFiltersChange` that writes back to the URL (debounced).
    //   3. Render a toolbar with filter inputs (see types/data-table.ts).
    // -----------------------------------------------------------------
    manualFiltering: true,
  })

  return { table }
}
