import { type Table as TanstackTable, flexRender } from '@tanstack/react-table'
import type * as React from 'react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table.tsx'
import { cn } from '#/lib/utils.ts'
import { DataTablePagination } from './data-table-pagination'

interface DataTableProps<TData> extends React.ComponentProps<'div'> {
  table: TanstackTable<TData>
  /**
   * Optional toolbar slot (filters / column view options). Render
   * `<DataTableToolbar table={table} />` here once server-side filtering is
   * enabled.
   */
  children?: React.ReactNode
  actionBar?: React.ReactNode
}

export function DataTable<TData>({
  table,
  children,
  actionBar,
  className,
}: DataTableProps<TData>) {
  return (
    <div className={cn('flex min-h-0 flex-1 flex-col gap-4', className)}>
      {children}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border">
        <div className="no-scrollbar min-h-0 flex-1 overflow-auto">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <DataTablePagination table={table} className="shrink-0" />
      {actionBar && table.getFilteredSelectedRowModel().rows.length > 0
        ? actionBar
        : null}
    </div>
  )
}
