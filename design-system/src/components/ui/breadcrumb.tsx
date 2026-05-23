import * as React from 'react'
import { ChevronRight } from 'lucide-react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

export const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<'nav'>
>(({ ...props }, ref) => <nav ref={ref} aria-label="Breadcrumb" {...props} />)
Breadcrumb.displayName = 'Breadcrumb'

export const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<'ol'>>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn(
        'mono flex flex-wrap items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[1.4px]',
        className
      )}
      style={{ color: 'var(--text-mute)' }}
      {...props}
    />
  )
)
BreadcrumbList.displayName = 'BreadcrumbList'

export const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<'li'>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn('inline-flex items-center gap-1.5', className)} {...props} />
  )
)
BreadcrumbItem.displayName = 'BreadcrumbItem'

export const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<'a'> & { asChild?: boolean }
>(({ asChild, className, ...props }, ref) => {
  const Comp: any = asChild ? Slot : 'a'
  return (
    <Comp
      ref={ref}
      className={cn('cursor-pointer transition-colors hover:text-[var(--brand)]', className)}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = 'BreadcrumbLink'

export const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<'span'>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-current="page"
      aria-disabled
      className={cn(className)}
      style={{ color: 'var(--text)' }}
      {...props}
    />
  )
)
BreadcrumbPage.displayName = 'BreadcrumbPage'

export function BreadcrumbSeparator({ className }: { className?: string }) {
  return (
    <span role="presentation" aria-hidden className={cn('inline-flex', className)}>
      <ChevronRight size={11} strokeWidth={1.8} />
    </span>
  )
}
