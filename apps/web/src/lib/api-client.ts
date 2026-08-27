import { hc } from 'hono/client'
import type { AppType } from '@server/index'
import { env } from '#/env'

export const apiClient = hc<AppType>(env.VITE_API_URL)
