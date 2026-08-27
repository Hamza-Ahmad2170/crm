import type { apiClient } from '@/lib/api-client'
import type { InferResponseType } from 'hono/client'

export type Customer = InferResponseType<
  (typeof apiClient.api.v1.customers)[':id']['$get'],
  200
>
