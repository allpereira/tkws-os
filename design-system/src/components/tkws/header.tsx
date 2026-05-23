import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * Fiel ao HTML · ds-header:
 *   padding 18px 0 · border-bottom 1px line-2 · margin-bottom 14px
 *   crumb: mono 10.5px tracking 1.3px uppercase text-mute weight 600
 *   h1: Fraunces 30px weight 400 letter-spacing -0.02em line-height 1.1
 *     em: italic text-soft weight 400
 *   desc: 13px text-soft margin-top 6px
 *
 * ds-subheader:
 *   padding 12px 0 · border-bottom 1px line-1 · margin-bottom 14px
 *   lbl: mono 10.5px tracking 1.4px uppercase text-mute weight 600
 */

export interface TkwsHeaderProps {
  crumb?: string
  title: React.ReactNode
  italic?: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

export function TkwsHeader({ crumb, title, italic, description, actions, className }: TkwsHeaderProps) {
  return (
    <div
      className={cn(
        'mb-3.5 flex flex-wrap items-end justify-between gap-4 border-b py-[18px] max-[760px]:flex-col max-[760px]:items-stretch',
        className
      )}
      style={{ borderColor: 'var(--line-2)' }}
    >
      <div className="flex-1">
        {crumb && (
          <div
            className="mono text-[10.5px] font-semibold uppercase tracking-[1.3px]"
            style={{ color: 'var(--text-mute)' }}
          >
            {crumb}
          </div>
        )}
        <h1
          className="serif mt-1.5 text-[30px] font-normal leading-[1.1]"
          style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
        >
          {title}
          {italic && (
            <em className="italic font-normal" style={{ color: 'var(--text-soft)' }}>
              {' '}
              {italic}
            </em>
          )}
        </h1>
        {description && (
          <div
            className="mt-1.5 text-[13px]"
            style={{ color: 'var(--text-soft)' }}
          >
            {description}
          </div>
        )}
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </div>
  )
}

export interface SubheaderProps {
  label: string
  actions?: React.ReactNode
  className?: string
}

export function Subheader({ label, actions, className }: SubheaderProps) {
  return (
    <div
      className={cn(
        'mb-3.5 flex items-center justify-between gap-3 border-b py-3',
        className
      )}
      style={{ borderColor: 'var(--line-1)' }}
    >
      <div
        className="mono text-[10.5px] font-semibold uppercase tracking-[1.4px]"
        style={{ color: 'var(--text-mute)' }}
      >
        {label}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
