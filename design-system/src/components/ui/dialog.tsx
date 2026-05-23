import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogPortal = DialogPrimitive.Portal
export const DialogClose = DialogPrimitive.Close

export const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 data-[state=open]:animate-fade-in',
      className
    )}
    style={{ background: 'rgba(6,24,40,0.78)', backdropFilter: 'blur(8px)' }}
    {...props}
  />
))
DialogOverlay.displayName = 'DialogOverlay'

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, style, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed top-1/2 left-1/2 z-50 grid w-full max-w-[480px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[14px] border duration-200',
        'data-[state=open]:animate-fade-in',
        className
      )}
      style={{
        background: 'var(--surface-1)',
        borderColor: 'var(--line-2)',
        boxShadow: 'var(--shadow-4)',
        ...style,
      }}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        className="absolute top-4 right-4 inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:brightness-125 focus:outline-none focus:ring-2 focus:ring-[var(--brand)] disabled:pointer-events-none"
        style={{ color: 'var(--text-mute)' }}
        aria-label="Fechar"
      >
        <X size={16} />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = 'DialogContent'

/**
 * Fiel ao HTML · ds-dialog-head: padding 20px 24px 16px · border-bottom line-1
 * h4: Fraunces 22px weight 400 · desc: 13px text-soft margin-top 6px
 */
export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col gap-1.5 border-b px-6 pt-5 pb-4 text-left', className)}
      style={{ borderColor: 'var(--line-1)' }}
      {...props}
    />
  )
}

/**
 * Fiel ao HTML · ds-dialog-body: padding 20px 24px
 */
export function DialogBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-6 py-5', className)} {...props} />
}

/**
 * Fiel ao HTML · ds-dialog-foot: padding 14px 24px · border-top line-1 · gap 10
 */
export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex justify-end gap-2.5 border-t px-6 py-3.5', className)}
      style={{ borderColor: 'var(--line-1)' }}
      {...props}
    />
  )
}

export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('serif text-[22px] font-normal', className)}
    style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
    {...props}
  />
))
DialogTitle.displayName = 'DialogTitle'

export const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('mt-1.5 text-[13px] leading-[1.5]', className)}
    style={{ color: 'var(--text-soft)' }}
    {...props}
  />
))
DialogDescription.displayName = 'DialogDescription'
