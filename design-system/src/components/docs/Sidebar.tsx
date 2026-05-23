import { Link, useLocation } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { navGroups } from '@/data/nav'
import { ThemeToggle } from './ThemeToggle'
import { cn } from '@/lib/utils'

const tagStyles: Record<string, { color: string; bg: string }> = {
  doc: { color: 'var(--purple)', bg: 'rgba(187,107,217,0.12)' },
  fnd: { color: 'var(--pink)', bg: 'rgba(241,120,182,0.12)' },
  cmp: { color: 'var(--brand)', bg: 'var(--brand-soft)' },
  pat: { color: 'var(--success)', bg: 'rgba(95,217,165,0.12)' },
  data: { color: 'var(--warning)', bg: 'rgba(242,201,76,0.12)' },
  mod: { color: 'var(--alert)', bg: 'rgba(242,153,74,0.12)' },
  bp: { color: 'var(--success)', bg: 'rgba(95,217,165,0.12)' },
  sh: { color: 'var(--text-mute)', bg: 'transparent' },
}

export function Sidebar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const location = useLocation()

  const filtered = useMemo(() => {
    if (!query.trim()) return navGroups
    const q = query.toLowerCase()
    return navGroups
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (i) =>
            i.name.toLowerCase().includes(q) ||
            i.num.includes(q) ||
            g.label.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.items.length > 0)
  }, [query])

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Abrir menu"
        className="fixed top-4 left-4 z-[250] hidden h-11 w-11 cursor-pointer items-center justify-center rounded-xl border shadow-lg backdrop-blur max-[900px]:inline-flex"
        style={{
          background: 'rgba(8,38,63,0.85)',
          borderColor: 'var(--line-3)',
          color: 'var(--text)',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-[200] flex w-[280px] flex-col overflow-hidden border-r backdrop-blur-2xl max-[900px]:w-[min(320px,90%)] max-[900px]:-translate-x-full max-[900px]:transition-transform max-[900px]:duration-300',
          open && 'max-[900px]:translate-x-0'
        )}
        style={{
          background: 'rgba(8,38,63,0.85)',
          borderColor: 'var(--line-2)',
          backdropFilter: 'blur(24px) saturate(180%)',
        }}
      >
        {/* Header · brand */}
        <div
          className="px-[22px] pt-[22px] pb-[18px]"
          style={{
            borderBottom: '1px solid var(--line-1)',
            background: 'linear-gradient(135deg, var(--brand-soft), transparent 70%)',
          }}
        >
          <div className="mb-1 flex items-baseline gap-2">
            <span
              className="serif text-[22px] font-normal tracking-tight"
              style={{ color: 'var(--text)' }}
            >
              TKWS <em className="italic" style={{ color: 'var(--brand)' }}>OS</em>
            </span>
            <span
              className="mono rounded px-1.5 py-0.5 text-[9px] font-extrabold tracking-widest"
              style={{ background: 'var(--brand)', color: 'var(--bg)' }}
            >
              DS
            </span>
          </div>
          <div className="mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-mute)' }}>
            Design System · v1.0
          </div>
          <div className="pulse-dot mono mt-2.5 inline-flex items-center text-[9.5px] font-bold uppercase tracking-wide" style={{ color: 'var(--success)' }}>
            Living guide
          </div>
        </div>

        {/* Search */}
        <div
          className="mx-4 mt-3 grid grid-cols-[14px_1fr] items-center gap-2 rounded-lg border px-3 py-2"
          style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)' }}
        >
          <Search size={14} style={{ color: 'var(--text-mute)' }} strokeWidth={1.6} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar seção…"
            className="w-full border-0 bg-transparent text-[12.5px] outline-0"
            style={{ color: 'var(--text)' }}
          />
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-[6px] pb-4">
          {filtered.map((group) => (
            <div key={group.id} className="mt-[14px] px-3 first:mt-1">
              <div className="flex items-center justify-between px-2.5 pt-2 pb-1.5">
                <span
                  className="mono text-[9.5px] font-bold uppercase tracking-wider"
                  style={{ color: 'var(--text-mute)' }}
                >
                  {group.label}
                </span>
                <span
                  className="mono rounded-full border px-1.5 py-px text-[9px] font-semibold"
                  style={{
                    color: tagStyles[group.tag].color,
                    background: tagStyles[group.tag].bg,
                    borderColor: tagStyles[group.tag].color,
                  }}
                >
                  {group.items.length}
                </span>
              </div>
              {group.items.map((item) => {
                const isActive = location.pathname === item.to
                return (
                  <Link
                    key={item.to}
                    to={item.to as any}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'relative grid grid-cols-[28px_1fr] items-center gap-2 rounded-md px-2.5 py-1.5 text-[12.5px] font-medium no-underline transition-colors',
                      isActive ? 'font-semibold' : 'hover:bg-white/[0.04]'
                    )}
                    style={{
                      background: isActive ? 'var(--brand-soft)' : 'transparent',
                      color: isActive ? 'var(--brand)' : 'var(--text-soft)',
                    }}
                  >
                    {isActive && (
                      <span
                        className="absolute top-1.5 -left-0.5 bottom-1.5 w-[3px] rounded-r"
                        style={{ background: 'var(--brand)' }}
                      />
                    )}
                    <span
                      className="mono text-[10px] font-bold"
                      style={{ color: isActive ? 'var(--brand)' : 'var(--text-mute)' }}
                    >
                      {item.num}
                    </span>
                    <span className="flex items-center leading-tight">
                      {item.name}
                      {item.count && (
                        <span
                          className="mono ml-1.5 rounded-full px-1.5 py-px text-[9px]"
                          style={{ background: 'var(--surface-3)', color: 'var(--text-mute)' }}
                        >
                          {item.count}
                        </span>
                      )}
                    </span>
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div
          className="flex flex-col gap-2.5 border-t px-4 py-3"
          style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="mono text-[9.5px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-mute)' }}>
              Tema
            </span>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[180] bg-black/40 backdrop-blur-sm max-[900px]:block hidden"
        />
      )}
    </>
  )
}
