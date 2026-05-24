import * as React from 'react'
import { GripVertical } from 'lucide-react'
import { Group, Panel, Separator } from 'react-resizable-panels'
import { cn } from '@/lib/utils'

/**
 * Resizable · wrapper de react-resizable-panels v4.
 *
 * API v4 renomeou:
 *   PanelGroup → Group
 *   PanelResizeHandle → Separator
 */

export const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof Group>) => (
  <Group
    className={cn('flex h-full w-full data-[panel-group-direction=vertical]:flex-col', className)}
    {...props}
  />
)

export const ResizablePanel = Panel

export const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof Separator> & { withHandle?: boolean }) => (
  <Separator
    className={cn(
      'relative flex w-px items-center justify-center transition-colors',
      'after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2',
      'data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full',
      'data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0',
      'hover:bg-[var(--brand)] focus-visible:outline-none focus-visible:ring-1',
      className,
    )}
    style={{ background: 'var(--line-2)' }}
    {...props}
  >
    {withHandle && (
      <div
        className="z-10 flex h-6 w-2.5 items-center justify-center rounded-sm border"
        style={{ background: 'var(--surface-2)', borderColor: 'var(--line-3)' }}
      >
        <GripVertical size={9} style={{ color: 'var(--text-mute)' }} />
      </div>
    )}
  </Separator>
)
