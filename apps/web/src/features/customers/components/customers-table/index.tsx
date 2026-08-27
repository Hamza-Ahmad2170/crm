import { useSuspenseQuery } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'
import { cn } from '#/lib/utils.ts'
import { DataTable } from '#/components/data-table/data-table'
import { useDataTable } from '@/hooks/use-data-table'
import { customersQueryOptions } from '@/features/customers/api'
import { columns } from './columns'

export function CustomersTable() {
  const routeSearch = useSearch({
    from: '/dashboard/customers',
  })

  const { data } = useSuspenseQuery(customersQueryOptions(routeSearch))

  const { table, isPending } = useDataTable({
    data: data.items,
    columns,
    pageCount: data.meta.totalPages,
  })

  return (
    <div
      className={cn('flex flex-1', {
        'opacity-60 transition-opacity': isPending,
      })}
    >
      <DataTable table={table} />
    </div>
  )
}

export function CustomersTableSkeleton() {
  return (
    <div className="flex flex-1 animate-pulse flex-col gap-4">
      <div className="bg-muted h-10 w-full rounded" />
      <div className="bg-muted h-72 w-full rounded-lg" />
      <div className="bg-muted h-10 w-full rounded" />
    </div>
  )
}
