import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: 'info' | 'success' | 'warning' | 'alert' | 'danger' | 'brand'
  onClose?: () => void
  /** Posição padrão para fixed · default 'top' */
  position?: 'top' | 'bottom' | 'inline'
  icon?: React.ReactNode
}

const toneBg: Record<NonNullable<BannerProps['tone']>, string> = {
  info: 'rgba(116,199,228,0.12)',
  brand: 'var(--brand-soft)',
  success: 'rgba(95,217,165,0.14)',
  warning: 'rgba(242,201,76,0.14)',
  alert: 'rgba(242,153,74,0.14)',
  danger: 'rgba(235,87,87,0.12)',
}
const toneBorder: Record<NonNullable<BannerProps['tone']>, string> = {
  info: 'var(--brand)',
  brand: 'var(--brand)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  alert: 'var(--alert)',
  danger: 'var(--danger)',
}

export function Banner({
  className,
  tone = 'brand',
  position = 'inline',
  onClose,
  icon,
  children,
  ...props
}: BannerProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex items-center justify-between gap-3 border-y px-4 py-2.5',
        position === 'top' && 'fixed inset-x-0 top-0 z-40',
        position === 'bottom' && 'fixed inset-x-0 bottom-0 z-40',
        className
      )}
      style={{
        background: toneBg[tone],
        borderColor: toneBorder[tone],
      }}
      {...props}
    >
      <div className="flex items-center gap-3 text-[12.5px]" style={{ color: 'var(--text)' }}>
        {icon && <span style={{ color: toneBorder[tone] }}>{icon}</span>}
        <div>{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-md transition-colors hover:brightness-125"
          style={{ color: 'var(--text-mute)' }}
        >
          <X size={13} />
        </button>
      )}
    </div>
  )
}
