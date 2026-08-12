import { getQueryClient } from './query-client'

/**
 * Builds the router context. The QueryClient is sourced from the singleton in
 * `query-client.ts` so every router creation reuses the same cached client.
 */
export function getContext() {
  return {
    queryClient: getQueryClient(),
  }
}
