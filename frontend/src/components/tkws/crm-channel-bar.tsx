import * as React from 'react'
import { Mail, MessageCircle, Phone, Send, Video } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

/**
 * ChannelBar · ações rápidas de contato (call, email, WhatsApp, video, SMS).
 * Cada canal pode ter um indicador de status (online, last-seen, unread count).
 * Use no header de Contact Card e no Detail panel do CRM.
 */

export type ChannelKind = 'phone' | 'email' | 'whatsapp' | 'video' | 'sms'

export interface ChannelButton {
  kind: ChannelKind
  /** Valor (telefone, email, etc.) · também usado como tooltip secundário */
  value?: string
  /** Badge contador (mensagens não lidas, p.ex.) */
  badge?: number
  /** Desabilita (sem permissão / sem dado) */
  disabled?: boolean
  /** Callback */
  onClick?: () => void
}

const config: Record<ChannelKind, { label: string; icon: React.ComponentType<any>; color: string }> = {
  phone: { label: 'Ligar', icon: Phone, color: 'var(--brand)' },
  email: { label: 'Email', icon: Mail, color: 'var(--purple)' },
  whatsapp: { label: 'WhatsApp', icon: MessageCircle, color: 'var(--success)' },
  video: { label: 'Videochamada', icon: Video, color: 'var(--pink)' },
  sms: { label: 'SMS', icon: Send, color: 'var(--alert)' },
}

export interface ChannelBarProps {
  channels: ChannelButton[]
  size?: 'sm' | 'md' | 'lg'
  className?: string
  /** Estilo grande = cards verticais com label · padrão = ícones inline. */
  variant?: 'inline' | 'cards'
}

const sizeMap = {
  sm: { btn: 'h-7 w-7', icon: 12 },
  md: { btn: 'h-9 w-9', icon: 14 },
  lg: { btn: 'h-11 w-11', icon: 18 },
}

export function ChannelBar({ channels, size = 'md', variant = 'inline', className }: ChannelBarProps) {
  if (variant === 'cards') {
    return (
      <div className={cn('grid gap-2', `grid-cols-${channels.length}`, className)} style={{ gridTemplateColumns: `repeat(${channels.length}, 1fr)` }}>
        {channels.map((ch) => {
          const c = config[ch.kind]
          const Icon = c.icon
          return (
            <button
              key={ch.kind}
              onClick={ch.onClick}
              disabled={ch.disabled}
              className={cn(
                'group flex cursor-pointer flex-col items-center gap-1.5 rounded-[10px] border p-3 transition-all',
                'hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50'
              )}
              style={{
                background: 'var(--surface-2)',
                borderColor: 'var(--line-2)',
              }}
              onMouseEnter={(e) => {
                if (!ch.disabled) {
                  e.currentTarget.style.borderColor = c.color
                  e.currentTarget.style.background = 'var(--surface-3)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--line-2)'
                e.currentTarget.style.background = 'var(--surface-2)'
              }}
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{ background: c.color + '22', color: c.color }}
              >
                <Icon size={16} strokeWidth={1.8} />
              </span>
              <span className="mono text-[10px] font-bold uppercase tracking-[1.2px]" style={{ color: 'var(--text)' }}>
                {c.label}
              </span>
              {ch.badge !== undefined && ch.badge > 0 && (
                <span
                  className="mono absolute inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold"
                  style={{ background: 'var(--danger)', color: '#fff', top: 8, right: 8 }}
                >
                  {ch.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      {channels.map((ch) => {
        const c = config[ch.kind]
        const Icon = c.icon
        const s = sizeMap[size]
        return (
          <Tooltip key={ch.kind}>
            <TooltipTrigger asChild>
              <button
                onClick={ch.onClick}
                disabled={ch.disabled}
                aria-label={c.label}
                className={cn(
                  'relative inline-flex cursor-pointer items-center justify-center rounded-full border transition-all',
                  'hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50',
                  s.btn
                )}
                style={{
                  background: 'var(--surface-2)',
                  borderColor: 'var(--line-2)',
                  color: c.color,
                }}
                onMouseEnter={(e) => {
                  if (!ch.disabled) {
                    e.currentTarget.style.borderColor = c.color
                    e.currentTarget.style.background = c.color + '1a'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--line-2)'
                  e.currentTarget.style.background = 'var(--surface-2)'
                }}
              >
                <Icon size={s.icon} strokeWidth={1.8} />
                {ch.badge !== undefined && ch.badge > 0 && (
                  <span
                    className="mono absolute -top-1 -right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold"
                    style={{ background: 'var(--danger)', color: '#fff' }}
                  >
                    {ch.badge}
                  </span>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {c.label}
              {ch.value && (
                <span className="mono ml-2 text-[10px]" style={{ color: 'var(--text-mute)' }}>
                  · {ch.value}
                </span>
              )}
            </TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}
