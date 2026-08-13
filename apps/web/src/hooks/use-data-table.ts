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
  pageCount: number
  initialState?: {
    pagination?: { pageSize: number }
    columnPinning?: ColumnPinningState
  }
}

export function useDataTable<TData>({
  data,
  columns,
  pageCount,
  initialState,
}: UseDataTableProps<TData>) {
  const search = useSearch({ strict: false }) as Record<string, unknown>
  const navigate = useNavigate() as (opts: {
    search: (prev: Record<string, unknown>) => Record<string, unknown>
    replace?: boolean
  }) => Promise<void>

  // Wraps every URL-driven update (pagination + sorting) so React keeps
  // showing the current table instead of falling back to Suspense while
  // the new page/sort data loads.
  const [isPending, startTransition] = React.useTransition()

  // --- PAGINATION ---
  const limit =
    Number(
      search.limit ?? initialState?.pagination?.pageSize ?? DEFAULT_PAGE_SIZE,
    ) || DEFAULT_PAGE_SIZE
  const offset = Number(search.offset ?? 0) || 0
  const pagination = React.useMemo<PaginationState>(
    () => ({
      pageIndex: limit > 0 ? Math.floor(offset / limit) : 0,
      pageSize: limit,
    }),
    [limit, offset],
  )

  const onPaginationChange = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      const next =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(pagination)
          : updaterOrValue
      startTransition(() => {
        void navigate({
          search: (prev) => ({
            ...prev,
            limit: next.pageSize,
            offset: next.pageIndex * next.pageSize,
          }),
          replace: true,
        })
      })
    },
    [pagination, navigate],
  )

  // --- SORTING ---
  const sortBy = search.sortBy as string | undefined
  const sortDirection = search.sortDirection as 'asc' | 'desc' | undefined
  const sorting = React.useMemo<SortingState>(
    () => (sortBy ? [{ id: sortBy, desc: sortDirection === 'desc' }] : []),
    [sortBy, sortDirection],
  )

  const onSortingChange = React.useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      const next =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(sorting)
          : updaterOrValue
      const first = next[0]
      startTransition(() => {
        void navigate({
          search: (prev) => ({
            ...prev,
            sortBy: first?.id ?? 'createdAt',
            sortDirection: first ? (first.desc ? 'desc' : 'asc') : 'desc',
          }),
          replace: true,
        })
      })
    },
    [sorting, navigate],
  )

  // --- LOCAL-ONLY UI STATE ---
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>(
    initialState?.columnPinning ?? {},
  )

  const table = useReactTable<TData>({
    data,
    columns,
    pageCount,
    state: {
      pagination,
      sorting,
      rowSelection,
      columnVisibility,
      columnPinning,
    },
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnPinningChange: setColumnPinning,
    onPaginationChange,
    onSortingChange,
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
  })

  return { table, isPending }
}
