import * as React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="Paginação"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  )
}

export const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('flex flex-row items-center gap-1', className)} {...props} />
  )
)
PaginationContent.displayName = 'PaginationContent'

export const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn('', className)} {...props} />
)
PaginationItem.displayName = 'PaginationItem'

export function PaginationLink({
  className,
  isActive,
  size = 'icon',
  ...props
}: { isActive?: boolean; size?: 'icon' | 'default' } & React.ComponentProps<'a'>) {
  return (
    <a
      role="button"
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center rounded-md border text-[12.5px] font-semibold transition-colors',
        size === 'icon' ? 'h-8 w-8' : 'h-8 px-3',
        className
      )}
      style={{
        background: isActive ? 'var(--brand-soft)' : 'transparent',
        borderColor: isActive ? 'var(--brand)' : 'var(--line-2)',
        color: isActive ? 'var(--brand)' : 'var(--text-soft)',
      }}
      {...props}
    />
  )
}

export function PaginationPrevious(props: React.ComponentProps<'a'>) {
  return (
    <PaginationLink size="default" {...props}>
      <ChevronLeft size={13} />
      <span className="ml-1">Anterior</span>
    </PaginationLink>
  )
}

export function PaginationNext(props: React.ComponentProps<'a'>) {
  return (
    <PaginationLink size="default" {...props}>
      <span className="mr-1">Próximo</span>
      <ChevronRight size={13} />
    </PaginationLink>
  )
}

export function PaginationEllipsis() {
  return (
    <span
      className="flex h-8 w-8 items-center justify-center"
      style={{ color: 'var(--text-mute)' }}
    >
      <MoreHorizontal size={14} />
    </span>
  )
}
