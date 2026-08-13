import * as React from 'react'

function PageSkeleton() {
  return (
    <div className="flex flex-1 animate-pulse flex-col gap-4">
      <div className="mb-2 h-8 w-48 rounded bg-muted" />
      <div className="h-4 w-96 rounded bg-muted" />
      <div className="mt-6 h-40 w-full rounded-lg bg-muted" />
      <div className="h-40 w-full rounded-lg bg-muted" />
    </div>
  )
}

/**
 * Standard wrapper for dashboard page content.
 *
 * - Renders a consistent page header (title + description + optional action).
 * - Shows a loading skeleton while data is loading.
 * - Renders an access fallback when `access` is false (render-level gating;
 *   not a substitute for real route-level auth).
 */
export default function PageContainer({
  children,
  isLoading = false,
  access = true,
  accessFallback,
  title,
  description,
  action,
}: {
  children: React.ReactNode
  isLoading?: boolean
  access?: boolean
  accessFallback?: React.ReactNode
  title?: string
  description?: string
  action?: React.ReactNode
}) {
  if (!access) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 md:px-6">
        {accessFallback ?? (
          <p className="text-muted-foreground text-center text-lg">
            You do not have access to this page.
          </p>
        )}
      </div>
    )
  }

  const hasHeader = title || action

  return (
    <div className="flex flex-1 flex-col p-4 md:px-6">
      {hasHeader && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="space-y-1">
            {title ? (
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            ) : null}
            {description ? (
              <p className="text-muted-foreground text-sm">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      )}
      {isLoading ? <PageSkeleton /> : children}
    </div>
  )
}
