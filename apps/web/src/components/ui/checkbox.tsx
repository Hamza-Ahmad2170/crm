import * as React from 'react'
import { Check, Minus } from 'lucide-react'

import { cn } from '#/lib/utils.ts'

/**
 * Styled native checkbox (base-ui has no checkbox primitive). Renders a check
 * icon when checked and a minus when indeterminate.
 */
export function Checkbox({
  className,
  indeterminate,
  ...props
}: Omit<React.ComponentProps<'input'>, 'type'> & {
  indeterminate?: boolean
}) {
  const state = indeterminate
    ? 'indeterminate'
    : props.checked
      ? 'checked'
      : 'unchecked'

  return (
    <span className="relative inline-flex size-4 shrink-0 items-center justify-center">
      <input
        type="checkbox"
        className={cn(
          'size-4 rounded-sm border border-input bg-background shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
          state !== 'unchecked' && 'border-primary bg-primary',
          className,
        )}
        {...props}
      />
      {state === 'checked' ? (
        <Check className="text-primary-foreground pointer-events-none absolute size-3" />
      ) : null}
      {state === 'indeterminate' ? (
        <Minus className="text-primary-foreground pointer-events-none absolute size-3" />
      ) : null}
    </span>
  )
}
