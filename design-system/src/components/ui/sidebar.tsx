import * as React from 'react'
import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

/**
 * Sidebar genérica (componente shadcn-block) para apps que precisam de nav lateral
 * separada da Sidebar de documentação. Estrutura:
 *   <Sidebar>
 *     <SidebarHeader />
 *     <SidebarContent>
 *       <SidebarGroup>
 *         <SidebarGroupLabel />
 *         <SidebarMenu>
 *           <SidebarMenuItem><SidebarMenuButton/></SidebarMenuItem>
 *         </SidebarMenu>
 *       </SidebarGroup>
 *     </SidebarContent>
 *     <SidebarFooter />
 *   </Sidebar>
 */

export const Sidebar = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & { collapsed?: boolean }>(
  ({ className, collapsed, ...props }, ref) => (
    <aside
      ref={ref}
      data-collapsed={collapsed ? 'true' : 'false'}
      className={cn(
        'flex h-full flex-col border-r transition-[width] duration-200',
        collapsed ? 'w-[68px]' : 'w-[260px]',
        className
      )}
      style={{ background: 'var(--surface-1)', borderColor: 'var(--line-1)' }}
      {...props}
    />
  )
)
Sidebar.displayName = 'Sidebar'

export function SidebarHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center gap-2 border-b px-4 py-3', className)}
      style={{ borderColor: 'var(--line-1)' }}
      {...props}
    />
  )
}

export function SidebarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex-1 overflow-y-auto py-2', className)} {...props} />
}

export function SidebarFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mt-auto border-t px-4 py-3', className)}
      style={{ borderColor: 'var(--line-1)' }}
      {...props}
    />
  )
}

export function SidebarGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-2 pt-2', className)} {...props} />
}

export function SidebarGroupLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'mono px-2 pt-1 pb-1.5 text-[9.5px] font-bold uppercase tracking-[1.4px]',
        className
      )}
      style={{ color: 'var(--text-mute)' }}
      {...props}
    />
  )
}

export function SidebarMenu({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn('flex flex-col gap-px', className)} {...props} />
}

export function SidebarMenuItem({ className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) {
  return <li className={cn('', className)} {...props} />
}

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  icon?: React.ReactNode
  badge?: React.ReactNode
  /** com children true mostra chevron */
  hasChildren?: boolean
}

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, active, icon, badge, hasChildren, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'grid w-full grid-cols-[20px_1fr_auto] items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[13px] font-medium outline-none transition-colors',
        'hover:bg-white/[0.06]',
        className
      )}
      style={{
        background: active ? 'var(--brand-soft)' : 'transparent',
        color: active ? 'var(--brand)' : 'var(--text-soft)',
      }}
      data-active={active}
      {...props}
    >
      <span className="flex h-5 w-5 items-center justify-center">{icon}</span>
      <span className="truncate">{children}</span>
      {badge ? <span>{badge}</span> : hasChildren ? <ChevronRight size={12} style={{ color: 'var(--text-mute)' }} /> : null}
    </button>
  )
)
SidebarMenuButton.displayName = 'SidebarMenuButton'

export function SidebarMenuSub({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={cn('ml-7 mt-0.5 flex flex-col gap-px border-l pl-2', className)}
      style={{ borderColor: 'var(--line-1)' }}
      {...props as any}
    />
  )
}
