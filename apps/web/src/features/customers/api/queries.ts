import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import type { CustomerListSchema } from '@repo/schema'
import { getCustomer, getCustomers } from './service'

export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  detail: (id: string) => [...customerKeys.all, 'detail', id] as const,
}

export const customersQueryOptions = (filters: CustomerListSchema) =>
  queryOptions({
    queryKey: [...customerKeys.lists(), filters],
    queryFn: () => getCustomers(filters),
    placeholderData: (previousData) => previousData,
  })

export const customerQueryOptions = (id: string) =>
  queryOptions({
    queryKey: customerKeys.detail(id),
    queryFn: () => getCustomer(id),
  })
