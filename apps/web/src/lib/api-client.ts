import { hc } from 'hono/client'
import type { AppType } from '@server/index'
import { env } from '#/env'

/**
 * Type-safe Hono RPC client.
 *
 * Routes are inferred from the API's `AppType`, so every request and response
 * is typed end-to-end. The base URL comes from `VITE_API_URL`.
 *
 * @example
 * const res = await apiClient.customers.$get({ query: { page: '1' } })
 * const { items } = await res.json()
 */
export const apiClient = hc<AppType>(env.VITE_API_URL)
