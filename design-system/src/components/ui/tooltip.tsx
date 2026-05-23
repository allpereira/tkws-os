import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '@/lib/utils'

export const TooltipProvider = TooltipPrimitive.Provider
export const Tooltip = TooltipPrimitive.Root
export const TooltipTrigger = TooltipPrimitive.Trigger

/**
 * Fiel ao HTML · ds-tip-content:
 *   bg var(--text) · color var(--bg) · invertido
 *   padding 6px 10px · radius 6px · font 11.5px/500
 *   shadow-2 · whitespace-nowrap por padrão
 */
export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 max-w-xs overflow-hidden rounded-[6px] px-2.5 py-1.5 text-[11.5px] font-medium data-[state=delayed-open]:animate-fade-in',
        className
      )}
      style={{
        background: 'var(--text)',
        color: 'var(--bg)',
        boxShadow: 'var(--shadow-2)',
      }}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = 'TooltipContent'
