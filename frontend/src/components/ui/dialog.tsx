import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Dialog · padrão TKWS OS · usando <dialog> HTML5.
 * Acessibilidade nativa (ESC fecha, focus trap, role=dialog).
 */

const DialogContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
} | null>(null)

function useDialogContext() {
  const ctx = React.useContext(DialogContext)
  if (!ctx) throw new Error('Dialog components must be used within <Dialog>')
  return ctx
}

export interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return <DialogContext.Provider value={{ open, onOpenChange }}>{children}</DialogContext.Provider>
}

export function DialogContent({
  children,
  className,
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  const { open, onOpenChange } = useDialogContext()
  const ref = React.useRef<HTMLDialogElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={() => onOpenChange(false)}
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false)
      }}
      className={cn(
        'fixed inset-0 m-auto max-h-[90vh] w-full max-w-lg p-0',
        'backdrop:backdrop-blur-sm',
        'open:animate-fade-in',
        className,
      )}
      style={{
        background: 'var(--surface-1)',
        color: 'var(--text)',
        border: '1px solid var(--line-2)',
        borderRadius: 14,
        boxShadow: 'var(--shadow-4)',
        ...style,
      }}
    >
      <style>{`dialog::backdrop { background: var(--overlay-strong); }`}</style>
      <div className="relative">
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          aria-label="Fechar"
          className="absolute top-3 right-3 inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-colors"
          style={{ color: 'var(--text-mute)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--surface-2)'
            e.currentTarget.style.color = 'var(--text)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--text-mute)'
          }}
        >
          <X size={16} />
        </button>
        {children}
      </div>
    </dialog>
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

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn('serif text-[20px] font-normal leading-tight', className)}
      style={{ color: 'var(--text)', letterSpacing: '-0.015em' }}
      {...props}
    />
  )
}

export function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-[13px]', className)}
      style={{ color: 'var(--text-soft)' }}
      {...props}
    />
  )
}

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
