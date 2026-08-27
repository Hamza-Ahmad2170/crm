import { QueryClient } from '@tanstack/react-query'

/**
 * Module-level singleton QueryClient.
 *
 * Created once and shared between the router context (consumed via React
 * context in components) and any non-component code (queryOptions / mutation
 * factories) that needs a handle to the same client. Creating it inside
 * `getContext()` on every call would produce multiple clients and lose the
 * cache across router re-creations during SSR.
 */
let queryClient: QueryClient | undefined

export function getQueryClient() {
  if (!queryClient) {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60_000,
        },
      },
    })
  }
  return queryClient
}

/** Override the singleton — useful for tests or custom setups. */
export function setQueryClient(client: QueryClient) {
  queryClient = client
}
