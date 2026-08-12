import { parseResponse } from 'hono/client'
import { apiClient } from '@/lib/api-client'
import type {
  CreateCustomerInput,
  CustomerListSchema,
  UpdateCustomerInput,
} from '@repo/schema'

export function getCustomers(filters: CustomerListSchema) {
  // limit/offset are numbers after validation, but the Hono client types
  // `z.coerce.number()` query params as strings (they travel as query strings).
  return parseResponse(
    apiClient.api.v1.customers.$get({
      query: {
        ...filters,
        limit: String(filters.limit),
        offset: String(filters.offset),
      },
    }),
  )
}

export function getCustomer(id: string) {
  return parseResponse(
    apiClient.api.v1.customers[':id'].$get({
      param: { id },
    }),
  )
}

export function createCustomer(input: CreateCustomerInput) {
  return parseResponse(
    apiClient.api.v1.customers.$post({
      json: input,
    }),
  )
}

export function updateCustomer(id: string, input: UpdateCustomerInput) {
  return parseResponse(
    apiClient.api.v1.customers[':id'].$patch({
      param: { id },
      json: input,
    }),
  )
}

export function deleteCustomer(id: string) {
  return parseResponse(
    apiClient.api.v1.customers[':id'].$delete({
      param: { id },
    }),
  )
}
