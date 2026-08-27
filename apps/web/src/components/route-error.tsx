import * as React from 'react'
import { Icons } from '@/components/icons'

import { Button } from '@/components/ui/button'

/**
 * Generic centered panel used by the router's default error / not-found
 * components. It renders inside the active layout (e.g. the dashboard chrome),
 * replacing only the page content — so the sidebar and header stay visible.
 */
export function RouteError({
  title,
  message,
  icon,
  action,
}: {
  title: string
  message?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="text-muted-foreground flex min-h-[50dvh] flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      {icon ?? <Icons.alertCircle className="size-10" />}
      <div className="space-y-1">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">
          {title}
        </h1>
        {message ? <p className="mx-auto max-w-md text-sm">{message}</p> : null}
      </div>
      {action}
    </div>
  )
}

function describe(error: unknown): string {
  if (error instanceof Error && error.message) return error.message
  if (typeof error === 'string' && error) return error
  return 'An unexpected error occurred. Please try again.'
}

/** Router-level fallback for any thrown loader/render error. */
export function DefaultErrorComponent({
  error,
  reset,
}: {
  error: unknown
  reset: () => void
}) {
  return (
    <RouteError
      title="Something went wrong"
      message={describe(error)}
      icon={<Icons.alertCircle className="text-destructive size-10" />}
      action={
        <Button variant="outline" onClick={reset}>
          <Icons.refresh />
          Try again
        </Button>
      }
    />
  )
}

/** Router-level fallback for unmatched routes (404). */
export function DefaultNotFoundComponent() {
  return (
    <RouteError
      title="404"
      message="Sorry, the page you are looking for doesn't exist or has been moved."
      icon={<Icons.compass className="size-10" />}
    />
  )
}
