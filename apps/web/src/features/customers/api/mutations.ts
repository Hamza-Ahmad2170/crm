import { mutationOptions, type QueryClient } from '@tanstack/react-query'
import { createCustomer, deleteCustomer, updateCustomer } from './service'
import { customerKeys } from './queries'
import type { UpdateCustomerInput } from '@repo/schema'

export const createCustomerMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
    },
  })

export const updateCustomerMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: ({ id, input }: { id: string; input: UpdateCustomerInput }) =>
      updateCustomer(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: customerKeys.detail(variables.id),
      })
    },
  })

export const deleteCustomerMutationOptions = (queryClient: QueryClient) =>
  mutationOptions({
    mutationFn: deleteCustomer,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all })
      queryClient.removeQueries({ queryKey: customerKeys.detail(id) })
    },
  })
