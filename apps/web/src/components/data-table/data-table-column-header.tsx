import type { Column } from '@tanstack/react-table'

import { Icons } from '#/components/icons.tsx'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '#/lib/utils.ts'

/**
 * Sortable column header (dropdown).
 *
 * - Title + sort indicator: `ArrowUpDown` by default, the direction icon once
 *   sorted.
 * - Menu options depend on `meta.table.variant`: A-Z / Z-A (default),
 *   0-1 / 1-0 (`number`), or Oldest / Newest (`date`), plus a Clear option.
 * - Non-sortable columns render a plain title.
 *
 * @example
 * header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />
 * // numeric column:
 * meta: { table: { variant: 'number' } }
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
  if (!column.getCanSort()) {
    return <span className={cn('text-sm font-medium', className)}>{title}</span>
  }

  const sorted = column.getIsSorted()
  const variant = column.columnDef.meta?.table?.variant

  const { AscIcon: SortAscIcon, DescIcon: SortDescIcon, ascLabel, descLabel } =
    variant === 'number'
      ? {
          AscIcon: Icons.arrowUp01,
          DescIcon: Icons.arrowDown01,
          ascLabel: '0-1',
          descLabel: '1-0',
        }
      : variant === 'date'
        ? {
            AscIcon: Icons.arrowUp,
            DescIcon: Icons.arrowDown,
            ascLabel: 'Oldest',
            descLabel: 'Newest',
          }
        : {
            AscIcon: Icons.arrowUp,
            DescIcon: Icons.arrowDown,
            ascLabel: 'A-Z',
            descLabel: 'Z-A',
          }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              '-ml-2 h-8 gap-1.5 px-2 text-sm font-medium',
              className,
            )}
          >
            <span>{title}</span>
            {sorted === 'asc' ? (
              <SortAscIcon className="size-3.5" />
            ) : sorted === 'desc' ? (
              <SortDescIcon className="size-3.5" />
            ) : (
              <Icons.arrowUpDown className="size-3.5 " />
            )}
          </Button>
        }
      />
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs">
            Sort by {title}
          </DropdownMenuLabel>
          <DropdownMenuItem
            className="gap-3"
            onClick={() => column.toggleSorting(false)}
          >
            <SortAscIcon className="size-3.5 text-muted-foreground" />
            <span>{ascLabel}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-3"
            onClick={() => column.toggleSorting(true)}
          >
            <SortDescIcon className="size-3.5 text-muted-foreground" />
            <span>{descLabel}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-3"
            onClick={() => column.clearSorting()}
          >
            <Icons.close className="size-3.5 text-muted-foreground" />
            <span>Clear</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
