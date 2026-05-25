import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Dialog · padrão TKWS OS · Radix Dialog.
 *
 * Usa `@radix-ui/react-dialog` (não `<dialog showModal>`) para que Select,
 * Popover e outros overlays portaled no `document.body` fiquem na mesma pilha
 * de stacking e recebam cliques dentro de formulários em modal.
 */

export interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  )
}

export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close
export const DialogPortal = DialogPrimitive.Portal

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 data-[state=open]:animate-fade-in', className)}
    style={{ background: 'var(--overlay-strong)', backdropFilter: 'blur(8px)' }}
    {...props}
  />
))
DialogOverlay.displayName = 'DialogOverlay'

export function DialogContent({
  children,
  className,
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          'fixed top-1/2 left-1/2 z-50 grid w-full max-w-lg max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[14px] border p-0',
          'data-[state=open]:animate-fade-in',
          className,
        )}
        style={{
          background: 'var(--surface-1)',
          color: 'var(--text)',
          borderColor: 'var(--line-2)',
          boxShadow: 'var(--shadow-4)',
          ...style,
        }}
      >
        <DialogPrimitive.Close
          type="button"
          aria-label="Fechar"
          className="absolute top-3 right-3 z-10 inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
          style={{ color: 'var(--text-mute)' }}
        >
          <X size={16} />
        </DialogPrimitive.Close>
        {children}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col gap-1 border-b px-6 pt-5 pb-4', className)}
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
    className={cn('serif text-[20px] font-normal leading-tight', className)}
    style={{ color: 'var(--text)', letterSpacing: '-0.015em' }}
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
    className={cn('text-[13px]', className)}
    style={{ color: 'var(--text-soft)' }}
    {...props}
  />
))
DialogDescription.displayName = 'DialogDescription'

export function DialogBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-6 py-5', className)} {...props} />
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-row-reverse items-center gap-2 border-t px-6 py-4', className)}
      style={{ borderColor: 'var(--line-1)' }}
      {...props}
    />
  )
}
