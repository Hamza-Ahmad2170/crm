import type { LucideIcon } from '@/components/icons'
import '@tanstack/react-table'

/**
 * Column metadata consumed by the data-table toolbar to auto-render a filter
 * input per column. Filters are not wired yet (search/sort are stubbed) — this
 * type is here so the toolbar can be dropped in later without changes.
 */
export type DataTableColumnMeta = {
  variant?:
    | 'text'
    | 'number'
    | 'range'
    | 'date'
    | 'dateRange'
    | 'select'
    | 'multiSelect'
  label?: string
  placeholder?: string
  options?: { label: string; value: string; icon?: LucideIcon }[]
}

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    /**
     * Opt a column into the data-table toolbar by setting `meta`. Reserved for
     * when server-side filtering is enabled.
     */
    table?: DataTableColumnMeta
  }
}
