import * as React from 'react'
import { AlertCircle, AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Fiel ao HTML · ds-alert:
 *   grid 28px 1fr auto · gap 14px · padding 14px 16px · radius 10px
 *   info:    bg rgba(116,199,228,0.08) · border rgba(116,199,228,0.30)
 *   success: bg rgba(95,217,165,0.08)  · border rgba(95,217,165,0.32)
 *   warning: bg rgba(242,201,76,0.06)  · border rgba(242,201,76,0.32)
 *   alert:   bg rgba(242,153,74,0.06)  · border rgba(242,153,74,0.32)
 *   danger:  bg rgba(235,87,87,0.06)   · border rgba(235,87,87,0.32)
 *   .ico: 26×26 · radius 6px · bg soft 0.18 · color tom
 *   .ttl: 13.5px/700 text · .desc: 12.5px text-soft line-height 1.55
 */

type Tone = 'info' | 'success' | 'warning' | 'alert' | 'danger'

const toneStyle: Record<
  Tone,
  { bg: string; border: string; icoBg: string; icoColor: string; Icon: React.ComponentType<any> }
> = {
  info: {
    bg: 'rgba(116,199,228,0.08)',
    border: 'rgba(116,199,228,0.30)',
    icoBg: 'rgba(116,199,228,0.18)',
    icoColor: 'var(--brand)',
    Icon: Info,
  },
  success: {
    bg: 'rgba(95,217,165,0.08)',
    border: 'rgba(95,217,165,0.32)',
    icoBg: 'rgba(95,217,165,0.18)',
    icoColor: 'var(--success)',
    Icon: CheckCircle2,
  },
  warning: {
    bg: 'rgba(242,201,76,0.06)',
    border: 'rgba(242,201,76,0.32)',
    icoBg: 'rgba(242,201,76,0.18)',
    icoColor: 'var(--warning)',
    Icon: AlertTriangle,
  },
  alert: {
    bg: 'rgba(242,153,74,0.06)',
    border: 'rgba(242,153,74,0.32)',
    icoBg: 'rgba(242,153,74,0.18)',
    icoColor: 'var(--alert)',
    Icon: AlertCircle,
  },
  danger: {
    bg: 'rgba(235,87,87,0.06)',
    border: 'rgba(235,87,87,0.32)',
    icoBg: 'rgba(235,87,87,0.18)',
    icoColor: 'var(--danger)',
    Icon: XCircle,
  },
}

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: Tone
  hideIcon?: boolean
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, tone = 'info', hideIcon, children, ...props }, ref) => {
    const c = toneStyle[tone]
    const Icon = c.Icon
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'grid items-start gap-3.5 rounded-[10px] border px-4 py-3.5',
          hideIcon ? 'grid-cols-1' : 'grid-cols-[28px_1fr]',
          className
        )}
        style={{
          background: c.bg,
          borderColor: c.border,
        }}
        {...props}
      >
        {!hideIcon && (
          <span
            className="inline-flex h-[26px] w-[26px] items-center justify-center rounded-[6px]"
            style={{ background: c.icoBg, color: c.icoColor }}
          >
            <Icon size={14} strokeWidth={2.2} />
          </span>
        )}
        <div className="flex flex-col gap-0.5">{children}</div>
      </div>
    )
  }
)
Alert.displayName = 'Alert'

export interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Nível do heading · default 'h3' · ajuste para hierarquia da página */
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export function AlertTitle({ className, as: Heading = 'h3', ...props }: AlertTitleProps) {
  return (
    <Heading
      className={cn('text-text font-sans text-[13.5px] font-bold leading-tight', className)}
      {...props}
    />
  )
}

export function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('text-[12.5px] leading-[1.55]', className)}
      style={{ color: 'var(--text-soft)' }}
      {...props}
    />
  )
}
