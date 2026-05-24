import * as React from 'react'
import { Badge, type BadgeTone } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface DetailHeroMeta {
  label: string
  value: React.ReactNode
}

export interface DetailHeroProps {
  cover?: React.ReactNode
  code?: string
  title: string
  italic?: string
  subtitle?: string
  status?: { label: string; tone: BadgeTone }
  meta?: DetailHeroMeta[]
  actions?: React.ReactNode
  className?: string
}

export function DetailHero({
  cover,
  code,
  title,
  italic,
  subtitle,
  status,
  meta,
  actions,
  className,
}: DetailHeroProps) {
  return (
    <header
      className={cn(
        'grid grid-cols-[160px_1fr] gap-6 rounded-2xl border p-6 max-[760px]:grid-cols-1',
        className
      )}
      style={{
        background:
          'linear-gradient(135deg, var(--brand-soft) 0%, transparent 70%), var(--surface-1)',
        borderColor: 'var(--line-1)',
      }}
    >
      <div
        className="aspect-[4/5] overflow-hidden rounded-xl"
        style={{ background: 'var(--surface-2)' }}
      >
        {cover}
      </div>

      <div className="flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            {code && (
              <div
                className="mono mb-2 text-[10.5px] font-bold uppercase tracking-[1.6px]"
                style={{ color: 'var(--text-mute)' }}
              >
                {code}
              </div>
            )}
            <h1
              className="serif text-[clamp(28px,4vw,40px)] font-light leading-[1.05] tracking-tight"
              style={{ color: 'var(--text)' }}
            >
              {title}
              {italic && (
                <em className="italic" style={{ color: 'var(--brand)' }}>
                  {' '}
                  {italic}
                </em>
              )}
            </h1>
            {subtitle && (
              <p
                className="mt-2 text-[14px] leading-relaxed"
                style={{ color: 'var(--text-soft)' }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {status && <Badge tone={status.tone}>{status.label}</Badge>}
        </div>

        {meta && meta.length > 0 && (
          <div
            className="mt-5 grid grid-cols-2 gap-5 border-t pt-4 md:grid-cols-4"
            style={{ borderColor: 'var(--line-1)' }}
          >
            {meta.map((m, i) => (
              <div key={i}>
                <div
                  className="mono text-[9.5px] font-bold uppercase tracking-[1.4px]"
                  style={{ color: 'var(--text-mute)' }}
                >
                  {m.label}
                </div>
                <div
                  className="serif mt-1 text-[18px] font-normal leading-tight"
                  style={{ color: 'var(--text)' }}
                >
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {actions && <div className="mt-5 flex gap-2">{actions}</div>}
      </div>
    </header>
  )
}
