import { parseResponse } from 'hono/client'
import { apiClient } from '@/lib/api-client'
import type { CreateCustomerInput, UpdateCustomerInput } from '@repo/schema'

export function getCustomers() {
  return parseResponse(apiClient.api.v1.customers.$get())
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
