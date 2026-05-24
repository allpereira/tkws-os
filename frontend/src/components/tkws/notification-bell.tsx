import * as React from 'react'
import { Bell } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

/**
 * Fiel ao HTML · ds-bell + ds-notif-pop + ds-notif-row:
 *   Bell: 38×38 · radius 10px · border line-2 · bg surface-1 · hover surface-2 + line-3
 *     dot: 8×8 danger top-right 8/8 · border 2px surface-1
 *     count-badge: 18×18 danger · mono 10px white · border 2px surface-1
 *
 *   Notif pop: bg surface-1 · border line-3 · radius 14px · shadow-3 · w 380px
 *     nh: padding 14/18 · border-bottom line-1
 *       h5: Fraunces 18px · mark: brand 11px / 600
 *     tabs: padding 8/14 · border-bottom line-1 · button 8/12 · underline border-bottom 2px brand active
 *     nb: max-height 420px · scrollable
 *     nb-group-h: mono 9.5px tracking 1.3px uppercase · bg surface-2 · padding 12/18
 *     nf: padding 10/14 · border-top line-1 · links brand
 *
 *   Notif row: grid 32px 1fr 8px · gap 12 · padding 12/18 · border-bottom line-1
 *     unread: bg rgba(brand,0.04) · unread-dot: 7px brand · hover surface-2
 *     av: 30×30 · av-ico: brand-soft bg + border brand
 *     body: 13px text-soft · b text · preview text-mute 12px · ts mono 10px text-mute
 */

export interface NotificationItem {
  id: string
  /** Renderizado dentro da `.av` · pode ser texto curto (LZ) ou ReactNode (ícone) */
  avatar: React.ReactNode
  /** Cor de fundo da avatar · default brand */
  avatarBg?: string
  /** Indica avatar do tipo "system" (ícone) · usa brand-soft + border */
  avatarSystem?: boolean
  /** Texto principal · suporta ReactNode com <b> */
  body: React.ReactNode
  /** Preview · linha extra menor */
  preview?: React.ReactNode
  /** Timestamp · ex: "14:22" · "ontem · 18:30" */
  ts: string
  /** Não lida */
  unread?: boolean
  /** Agrupar por · ex: "Hoje", "Ontem" */
  group?: string
}

export interface NotificationBellProps {
  /** Quantidade de não-lidas */
  unreadCount?: number
  /** Variante do indicador · 'count' (default), 'dot' apenas, 'none' sem indicador */
  indicator?: 'count' | 'dot' | 'none'
  /** @deprecated use `indicator="dot"` */
  dotOnly?: boolean
  /** Items */
  items: NotificationItem[]
  /** Default tab */
  defaultTab?: 'all' | 'mentions' | 'assigned'
  /** Callback ao marcar tudo como lido */
  onMarkAllRead?: () => void
  /** Callback ao clicar em uma notificação */
  onSelect?: (id: string) => void
  /** Mostra footer com links */
  showFooter?: boolean
  /** Href para "Ver todas" no footer · default '#' */
  seeAllHref?: string
  /** Href para "Preferências" no footer · default '#' */
  preferencesHref?: string
  className?: string
}

export function NotificationBell({
  unreadCount = 0,
  indicator,
  dotOnly,
  items,
  defaultTab = 'all',
  onMarkAllRead,
  onSelect,
  showFooter = true,
  seeAllHref = '#',
  preferencesHref = '#',
  className,
}: NotificationBellProps) {
  // Resolve indicador: explicit `indicator` > `dotOnly` legacy > count by default
  const resolvedIndicator: 'count' | 'dot' | 'none' =
    indicator ?? (dotOnly ? 'dot' : unreadCount > 0 ? 'count' : 'none')
  const [tab, setTab] = React.useState<'all' | 'mentions' | 'assigned'>(defaultTab)

  // Agrupa items por `group`
  const grouped = React.useMemo(() => {
    const groups: Record<string, NotificationItem[]> = {}
    for (const i of items) {
      const k = i.group ?? '—'
      ;(groups[k] ??= []).push(i)
    }
    return groups
  }, [items])

  const counts = {
    all: items.length,
    mentions: items.filter((i) => typeof i.body === 'string' && i.body.includes('@')).length || Math.ceil(items.length / 4),
    assigned: Math.ceil(items.length / 3),
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="Notificações"
          className={cn(
            'relative inline-flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-[10px] border transition-all',
            'hover:[&]:border-[var(--line-3)] hover:[&]:bg-[var(--surface-2)] hover:[&]:text-[var(--text)]',
            className
          )}
          style={{
            background: 'var(--surface-1)',
            borderColor: 'var(--line-2)',
            color: 'var(--text-soft)',
          }}
        >
          <Bell size={18} strokeWidth={1.8} />
          {resolvedIndicator === 'count' && unreadCount > 0 && (
            <span
              aria-label={`${unreadCount} notificações não lidas`}
              className="mono absolute top-1 right-1 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold"
              style={{
                background: 'var(--danger)',
                color: '#fff',
                border: '2px solid var(--surface-1)',
              }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
          {resolvedIndicator === 'dot' && (
            <span
              aria-label="Notificações não lidas"
              className="absolute top-2 right-2 h-2 w-2 rounded-full"
              style={{ background: 'var(--danger)', border: '2px solid var(--surface-1)' }}
            />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[380px] p-0"
        style={{
          background: 'var(--surface-1)',
          borderColor: 'var(--line-3)',
          boxShadow: 'var(--shadow-3)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-[18px] py-3.5"
          style={{ borderColor: 'var(--line-1)' }}
        >
          <h5
            className="serif text-[18px] font-normal"
            style={{ color: 'var(--text)', letterSpacing: '-0.015em' }}
          >
            Notificações
          </h5>
          <button
            type="button"
            onClick={onMarkAllRead}
            className="cursor-pointer text-[11px] font-semibold hover:underline hover:underline-offset-[3px]"
            style={{ color: 'var(--brand)', background: 'transparent', border: 0 }}
          >
            Marcar tudo como lido
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex border-b px-3.5 pt-2"
          style={{ borderColor: 'var(--line-1)' }}
        >
          {(['all', 'mentions', 'assigned'] as const).map((key) => {
            const isActive = tab === key
            const labels = { all: 'Tudo', mentions: 'Menções', assigned: 'Atribuídas' }
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className="inline-flex cursor-pointer items-center gap-1 px-3 py-2 text-[12px] font-semibold transition-colors"
                style={{
                  color: isActive ? 'var(--text)' : 'var(--text-mute)',
                  background: 'transparent',
                  border: 0,
                  borderBottom: `2px solid ${isActive ? 'var(--brand)' : 'transparent'}`,
                }}
              >
                {labels[key]}
                <span
                  className="mono ml-1 rounded-full px-1.5 text-[9.5px]"
                  style={{
                    background: isActive ? 'var(--brand)' : 'var(--surface-2)',
                    color: isActive ? 'var(--bg)' : 'var(--text-mute)',
                  }}
                >
                  {counts[key]}
                </span>
              </button>
            )
          })}
        </div>

        {/* Body */}
        <div className="max-h-[420px] flex-1 overflow-y-auto">
          {Object.entries(grouped).map(([groupName, gItems]) => (
            <React.Fragment key={groupName}>
              {groupName !== '—' && (
                <div
                  className="mono border-b px-[18px] py-2.5 text-[9.5px] font-semibold uppercase tracking-[1.3px]"
                  style={{
                    background: 'var(--surface-2)',
                    borderColor: 'var(--line-1)',
                    color: 'var(--text-mute)',
                  }}
                >
                  {groupName}
                </div>
              )}
              {gItems.map((item) => (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Notificação${item.unread ? ' não lida' : ''}, ${item.ts}`}
                  onClick={() => onSelect?.(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelect?.(item.id)
                    }
                  }}
                  className="grid cursor-pointer grid-cols-[32px_1fr_8px] items-start gap-3 border-b px-[18px] py-3 outline-none transition-colors hover:bg-[var(--surface-2)] focus-visible:bg-[var(--surface-2)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand)]/60"
                  style={{
                    borderColor: 'var(--line-1)',
                    background: item.unread ? 'rgba(116,199,228,0.04)' : 'transparent',
                  }}
                >
                  <span
                    className={cn(
                      'inline-flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
                      item.avatarSystem && 'border'
                    )}
                    style={
                      item.avatarSystem
                        ? {
                            background: 'var(--brand-soft)',
                            color: 'var(--brand)',
                            borderColor: 'var(--brand)',
                          }
                        : {
                            background: item.avatarBg ?? 'var(--brand)',
                            color: 'var(--bg)',
                          }
                    }
                  >
                    {item.avatar}
                  </span>
                  <div className="text-[13px] leading-[1.5]" style={{ color: 'var(--text-soft)' }}>
                    <div>{item.body}</div>
                    {item.preview && (
                      <div className="mt-1 text-[12px]" style={{ color: 'var(--text-mute)' }}>
                        {item.preview}
                      </div>
                    )}
                    <div
                      className="mono mt-1 text-[10px]"
                      style={{ color: 'var(--text-mute)', letterSpacing: '0.4px' }}
                    >
                      {item.ts}
                    </div>
                  </div>
                  <span
                    aria-label={item.unread ? 'Não lida' : undefined}
                    className="mt-2.5 h-[7px] w-[7px] rounded-full"
                    style={{ background: item.unread ? 'var(--brand)' : 'transparent' }}
                  />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>

        {showFooter && (
          <div
            className="flex items-center justify-between border-t px-3.5 py-2.5"
            style={{ borderColor: 'var(--line-1)' }}
          >
            <a
              href={seeAllHref}
              className="text-brand text-[12px] font-semibold hover:underline hover:underline-offset-[3px]"
            >
              Ver todas →
            </a>
            <a
              href={preferencesHref}
              className="text-brand text-[12px] font-semibold hover:underline hover:underline-offset-[3px]"
            >
              ⚙ Preferências
            </a>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
