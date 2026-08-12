import { useSuspenseQuery } from '@tanstack/react-query'
import { useSearch } from '@tanstack/react-router'

import { DataTable } from '@/components/ui/data-table'
import { useDataTable } from '@/hooks/use-data-table'
import { customersQueryOptions } from '@/features/customers/api'
import { columns } from './columns'

export function CustomersTable() {
  const routeSearch = useSearch({
    from: '/dashboard/customers',
  })

  const { data } = useSuspenseQuery(customersQueryOptions({ ...routeSearch }))

  const { table } = useDataTable({
    data: data.items,
    columns,
    pageCount: data.meta.totalPages,
  })

  return <DataTable table={table} />
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
