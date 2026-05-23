import * as React from 'react'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { ChevronDown } from 'lucide-react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn('relative z-10 flex max-w-max flex-1 items-center justify-center', className)}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = 'NavigationMenu'

export const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn('group flex flex-1 list-none items-center justify-center gap-1', className)}
    {...props}
  />
))
NavigationMenuList.displayName = 'NavigationMenuList'

export const NavigationMenuItem = NavigationMenuPrimitive.Item

const triggerStyle = cva(
  'group inline-flex h-9 w-max items-center gap-1.5 rounded-md px-3 text-[13px] font-semibold transition-colors outline-none cursor-pointer data-[state=open]:[&]:bg-[var(--surface-3)] data-[active]:[&]:bg-[var(--surface-3)]'
)

export const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(triggerStyle(), className)}
    style={{ color: 'var(--text-soft)' }}
    {...props}
  >
    {children}
    <ChevronDown
      size={12}
      className="transition-transform group-data-[state=open]:rotate-180"
      style={{ color: 'var(--text-mute)' }}
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = 'NavigationMenuTrigger'

export const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      'left-0 top-0 w-full md:absolute md:w-auto',
      'data-[motion=from-start]:animate-fade-in data-[motion=from-end]:animate-fade-in data-[motion=to-start]:animate-fade-in data-[motion=to-end]:animate-fade-in',
      className
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = 'NavigationMenuContent'

export const NavigationMenuLink = NavigationMenuPrimitive.Link

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn('absolute left-0 top-full flex justify-center')}>
    <NavigationMenuPrimitive.Viewport
      ref={ref}
      className={cn(
        'origin-top-center relative mt-2 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-xl border shadow-2xl md:w-[var(--radix-navigation-menu-viewport-width)]',
        className
      )}
      style={{ background: 'var(--surface-1)', borderColor: 'var(--line-2)' }}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName = 'NavigationMenuViewport'
