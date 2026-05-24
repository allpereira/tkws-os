import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Table · padrão TKWS OS · headers mono uppercase, linhas com hover surface-2.
 */

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div
      className="w-full overflow-auto rounded-[12px] border"
      style={{ borderColor: 'var(--line-1)' }}
    >
      <table
        ref={ref}
        className={cn('w-full caption-bottom text-[13px]', className)}
        style={{ borderCollapse: 'separate', borderSpacing: 0 }}
        {...props}
      />
    </div>
  ),
)
Table.displayName = 'Table'

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(className)}
      style={{ background: 'var(--surface-2)' }}
      {...props}
    />
  )
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn(className)} {...props} />
}

export function TableFooter({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      className={cn('font-medium', className)}
      style={{ background: 'var(--surface-2)', borderTop: '1px solid var(--line-1)' }}
      {...props}
    />
  )
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn('transition-colors', className)}
      style={{ borderBottom: '1px solid var(--line-1)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--surface-2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = ''
      }}
      {...props}
    />
  )
}

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'mono h-10 px-3 text-left align-middle text-[10.5px] font-bold uppercase',
        className,
      )}
      style={{
        color: 'var(--text-mute)',
        letterSpacing: '1.3px',
        borderBottom: '1px solid var(--line-1)',
      }}
      {...props}
    />
  )
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn('px-3 py-3 align-middle text-[13px]', className)}
      style={{ color: 'var(--text)' }}
      {...props}
    />
  )
}
