import * as React from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { cn } from '@/lib/utils'

export const AlertDialog = AlertDialogPrimitive.Root
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger
export const AlertDialogPortal = AlertDialogPrimitive.Portal

export const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 data-[state=open]:animate-dialog-fade-in', className)}
    style={{ background: 'rgba(6,24,40,0.78)', backdropFilter: 'blur(8px)' }}
    {...props}
  />
))
AlertDialogOverlay.displayName = 'AlertDialogOverlay'

export const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed top-1/2 left-1/2 z-50 grid w-full max-w-md -translate-x-1/2 -translate-y-1/2 gap-4 rounded-[14px] border p-6 data-[state=open]:animate-dialog-fade-in',
        className
      )}
      style={{
        background: 'var(--surface-1)',
        borderColor: 'var(--danger)',
        boxShadow: 'var(--shadow-4)',
      }}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = 'AlertDialogContent'

export function AlertDialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1.5 text-left', className)} {...props} />
}
export function AlertDialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2', className)} {...props} />
}

export const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn('serif text-[20px] font-normal tracking-tight', className)}
    style={{ color: 'var(--text)' }}
    {...props}
  />
))
AlertDialogTitle.displayName = 'AlertDialogTitle'

export const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn('text-[13.5px] leading-relaxed', className)}
    style={{ color: 'var(--text-soft)' }}
    {...props}
  />
))
AlertDialogDescription.displayName = 'AlertDialogDescription'

export const AlertDialogAction = AlertDialogPrimitive.Action
export const AlertDialogCancel = AlertDialogPrimitive.Cancel
