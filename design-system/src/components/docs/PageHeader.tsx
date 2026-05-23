import { type ReactNode } from 'react'

type Props = {
  num: string
  category: string
  title: string
  italic?: string
  description: string
  tag?: string
  actions?: ReactNode
}

export function PageHeader({ num, category, title, italic, description, tag, actions }: Props) {
  return (
    <header className="mb-12 max-[760px]:mb-8">
      <div className="mb-3.5 flex items-center gap-3">
        <span
          className="mono inline-block text-[11px] font-bold uppercase tracking-[2px]"
          style={{ color: 'var(--brand)' }}
        >
          <span style={{ color: 'var(--text-mute)' }}>{num}</span> · {category}
        </span>
        {tag && (
          <span
            className="mono inline-flex items-center rounded-full border px-2 py-0.5 text-[9.5px] font-semibold"
            style={{
              color: 'var(--text-soft)',
              background: 'var(--surface-2)',
              borderColor: 'var(--line-2)',
            }}
          >
            {tag}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between gap-6 max-[760px]:flex-col max-[760px]:items-start">
        <div className="max-w-3xl">
          <h1
            className="display-2 text-[clamp(36px,5vw,52px)]"
            style={{ color: 'var(--text)' }}
          >
            {title}
            {italic && (
              <em className="italic" style={{ color: 'var(--text-soft)' }}>
                {' '}
                {italic}
              </em>
            )}
          </h1>
          <p
            className="mt-4 max-w-2xl text-[15px] leading-relaxed"
            style={{ color: 'var(--text-soft)' }}
          >
            {description}
          </p>
        </div>
        {actions && <div className="flex gap-2.5">{actions}</div>}
      </div>
    </header>
  )
}
