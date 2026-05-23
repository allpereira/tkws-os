import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * ButtonGroup · agrupa botões correlacionados com borders fundidas.
 * Use em segmented controls onde Toggle Group seria muito leve.
 */
export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = 'horizontal', ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      data-orientation={orientation}
      className={cn(
        'inline-flex isolate',
        orientation === 'horizontal'
          ? '[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:-ml-px [&>*:not(:last-child)]:rounded-r-none [&>*:hover]:z-10 [&>*:focus]:z-10'
          : 'flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:-mt-px [&>*:not(:last-child)]:rounded-b-none',
        className
      )}
      {...props}
    />
  )
)
ButtonGroup.displayName = 'ButtonGroup'
