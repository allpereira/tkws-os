import * as React from 'react'
import { Link, useLocation, useRouter } from '@tanstack/react-router'
import {
  Bell,
  Boxes,
  Briefcase,
  Building2,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Cog,
  Command,
  CreditCard,
  HardHat,
  Kanban as KanbanIcon,
  LayoutGrid,
  Layers,
  LifeBuoy,
  LogOut,
  MapPin,
  Menu,
  Network,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  UserCircle2,
  User as UserIcon,
  Users,
  X,
} from 'lucide-react'
import { useAuth } from 'react-oidc-context'
import { Avatar, initialsOf } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ThemeToggle } from '@/components/tkws/theme-toggle'
import { cn } from '@/lib/utils'

/**
 * AppShell · padrão TKWS OS (design-system/src/pages/patterns/AppShell.tsx).
 *
 * Layout master:
 *   ┌─────────────┬──────────────────────────────────────┐
 *   │   SIDEBAR   │            TOP HEADER                │
 *   │   (240 →    ├──────────────────────────────────────┤
 *   │   60 col.)  │                                      │
 *   │             │           CONTENT                    │
 *   │             │                                      │
 *   │             ├──────────────────────────────────────┤
 *   │             │           STATUS BAR                 │
 *   └─────────────┴──────────────────────────────────────┘
 *
 * Mobile: sidebar vira drawer overlay (<md).
 * Estado collapsed persistido em localStorage.
 */

// ---------------------------------------------------------------------------
// Nav data · alinhado com as rotas declaradas em app/route-tree.tsx
// ---------------------------------------------------------------------------

interface NavItem {
  to: string
  label: string
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
  badge?: { label: string; tone: 'brand' | 'success' | 'warning' | 'danger' | 'neutral' | 'purple' }
}

interface NavGroup {
  id: string
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    id: 'crm',
    label: 'CRM',
    items: [
      { to: '/crm/leads', label: 'Leads', Icon: UserCircle2 },
      { to: '/crm/clientes', label: 'Clientes', Icon: Users },
      { to: '/crm/atendimento', label: 'Atendimento', Icon: KanbanIcon },
      { to: '/crm/propostas', label: 'Propostas', Icon: Briefcase },
    ],
  },
  {
    id: 'settings-crm',
    label: 'Config · CRM',
    items: [
      { to: '/settings/crm/tipos-pagamentos', label: 'Tipos de Pagamentos', Icon: CreditCard },
      { to: '/settings/crm/pipelines', label: 'Pipelines', Icon: Network },
      { to: '/settings/crm/etapas', label: 'Etapas', Icon: Layers },
    ],
  },
  {
    id: 'settings-organizacao',
    label: 'Config · Organização',
    items: [
      { to: '/settings/organizacao/ofertas', label: 'Ofertas', Icon: ShoppingBag },
      { to: '/settings/organizacao/tipos-empresa', label: 'Tipos de Empresa', Icon: Building2 },
      { to: '/settings/organizacao/unidades', label: 'Unidades', Icon: MapPin },
      { to: '/settings/organizacao/setores', label: 'Setores', Icon: LayoutGrid },
      { to: '/settings/organizacao/tipos-projetos', label: 'Tipos de Projetos', Icon: Boxes },
      { to: '/settings/organizacao/funcoes-pessoas', label: 'Funções de Pessoas', Icon: Briefcase },
      { to: '/settings/organizacao/empreendimentos', label: 'Empreendimentos', Icon: HardHat },
    ],
  },
]

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

function useCollapsedPersist() {
  const [collapsed, setCollapsed] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem('tkws.sidebar.collapsed') === '1'
  })
  React.useEffect(() => {
    window.localStorage.setItem('tkws.sidebar.collapsed', collapsed ? '1' : '0')
  }, [collapsed])
  return [collapsed, setCollapsed] as const
}

function useEscapeKey(active: boolean, handler: () => void) {
  React.useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handler()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, handler])
}

// ---------------------------------------------------------------------------
// User menu (dropdown leve)
// ---------------------------------------------------------------------------

function UserMenu({ name, email }: { name?: string; email?: string }) {
  const auth = useAuth()
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('mousedown', onClick)
    return () => window.removeEventListener('mousedown', onClick)
  }, [open])

  const handleLogout = () => {
    setOpen(false)
    void auth.signoutRedirect?.().catch(() => {
      // fallback · limpa sessão local e recarrega
      auth.removeUser?.()
      window.location.assign('/')
    })
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex cursor-pointer items-center gap-2 rounded-pill border p-1 transition-colors"
        style={{ background: 'var(--surface-2)', borderColor: 'var(--line-2)' }}
      >
        <Avatar size="sm" style={{ background: 'var(--purple)', color: '#fff' }}>
          {initialsOf(name)}
        </Avatar>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-[12px] border shadow-3"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--line-2)' }}
        >
          <div
            className="border-b px-3 py-2.5"
            style={{ borderColor: 'var(--line-1)' }}
          >
            <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
              {name ?? 'Usuário'}
            </div>
            {email && (
              <div className="mono mt-0.5 text-[10.5px]" style={{ color: 'var(--text-mute)' }}>
                {email}
              </div>
            )}
          </div>
          <MenuItem icon={<UserIcon size={13} />} label="Meu perfil" />
          <MenuItem icon={<Cog size={13} />} label="Preferências" />
          <MenuItem icon={<LifeBuoy size={13} />} label="Suporte" />
          <div className="my-1 h-px" style={{ background: 'var(--line-1)' }} />
          <MenuItem
            icon={<LogOut size={13} />}
            label="Sair"
            tone="danger"
            onClick={handleLogout}
          />
        </div>
      )}
    </div>
  )
}

function MenuItem({
  icon,
  label,
  tone = 'default',
  onClick,
}: {
  icon: React.ReactNode
  label: string
  tone?: 'default' | 'danger'
  onClick?: () => void
}) {
  const color = tone === 'danger' ? 'var(--danger)' : 'var(--text)'
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-[13px] transition-colors"
      style={{ color }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      <span style={{ color: tone === 'danger' ? 'var(--danger)' : 'var(--text-mute)' }}>{icon}</span>
      {label}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

function SidebarBrand({ collapsed }: { collapsed: boolean }) {
  return (
    <Link
      to="/"
      className="flex items-center justify-between border-b px-4 py-3.5"
      style={{ borderColor: 'var(--line-1)' }}
    >
      {!collapsed ? (
        <div className="flex items-baseline gap-2">
          <span
            className="serif text-[18px] font-normal"
            style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
          >
            TKWS{' '}
            <em className="italic" style={{ color: 'var(--brand)' }}>
              OS
            </em>
          </span>
          <span
            className="mono rounded px-1.5 py-0.5 text-[9px] font-extrabold tracking-widest"
            style={{ background: 'var(--brand)', color: 'var(--bg)' }}
          >
            v0.1
          </span>
        </div>
      ) : (
        <span
          className="serif w-full text-center text-[20px] font-normal italic"
          style={{ color: 'var(--brand)', letterSpacing: '-0.02em' }}
        >
          T
        </span>
      )}
    </Link>
  )
}

function NavGroupBlock({
  group,
  currentPath,
  collapsed,
}: {
  group: NavGroup
  currentPath: string
  collapsed: boolean
}) {
  return (
    <div className="px-3 pt-2">
      {!collapsed ? (
        <div
          className="mono mb-1 px-2 text-[9.5px] font-semibold uppercase tracking-[1.4px]"
          style={{ color: 'var(--text-mute)' }}
        >
          {group.label}
        </div>
      ) : (
        <div
          className="mb-1 h-px"
          style={{ background: 'var(--line-1)' }}
          aria-hidden
        />
      )}
      <ul className="flex flex-col gap-px">
        {group.items.map((it) => (
          <SidebarItem key={it.to} item={it} currentPath={currentPath} collapsed={collapsed} />
        ))}
      </ul>
    </div>
  )
}

function SidebarItem({
  item,
  currentPath,
  collapsed,
}: {
  item: NavItem
  currentPath: string
  collapsed: boolean
}) {
  const active = currentPath === item.to || currentPath.startsWith(`${item.to}/`)
  const baseStyle: React.CSSProperties = {
    background: active ? 'var(--brand-soft)' : 'transparent',
    color: active ? 'var(--brand)' : 'var(--text-soft)',
  }

  const link = (
    <Link
      to={item.to as any}
      className={cn(
        'group flex items-center rounded-[8px] text-[13px] font-medium transition-colors',
        'hover:bg-white/[0.06]',
        collapsed
          ? 'h-9 w-full justify-center'
          : 'grid w-full grid-cols-[20px_1fr_auto] items-center gap-2.5 px-2.5 py-1.5 text-left',
      )}
      style={baseStyle}
    >
      <span className="flex items-center justify-center">
        <item.Icon size={14} strokeWidth={1.8} />
      </span>
      {!collapsed && <span className="truncate">{item.label}</span>}
      {!collapsed && item.badge && <Badge tone={item.badge.tone}>{item.badge.label}</Badge>}
    </Link>
  )

  return (
    <li>
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right">{item.label}</TooltipContent>
        </Tooltip>
      ) : (
        link
      )}
    </li>
  )
}

function SidebarFooter({
  collapsed,
  onToggle,
  user,
}: {
  collapsed: boolean
  onToggle: () => void
  user?: { name?: string; email?: string }
}) {
  return (
    <div
      className="flex flex-col gap-2 border-t p-3"
      style={{ borderColor: 'var(--line-1)' }}
    >
      {!collapsed ? (
        <UserDropdown user={user}>
          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-2.5 rounded-[8px] px-2 py-1.5 transition-colors hover:bg-white/[0.06]"
          >
            <Avatar size="sm" style={{ background: 'var(--purple)', color: '#fff' }}>
              {initialsOf(user?.name)}
            </Avatar>
            <div className="min-w-0 flex-1 text-left leading-tight">
              <div
                className="truncate text-[12.5px] font-semibold"
                style={{ color: 'var(--text)' }}
              >
                {user?.name ?? 'Usuário'}
              </div>
              {user?.email && (
                <div className="mono truncate text-[10px]" style={{ color: 'var(--text-mute)' }}>
                  {user.email}
                </div>
              )}
            </div>
            <ChevronRight size={12} style={{ color: 'var(--text-mute)' }} />
          </button>
        </UserDropdown>
      ) : (
        <UserDropdown user={user}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label={user?.name ?? 'Usuário'}
                className="flex h-9 w-full cursor-pointer items-center justify-center rounded-[8px] transition-colors hover:bg-white/[0.06]"
              >
                <Avatar size="sm" style={{ background: 'var(--purple)', color: '#fff' }}>
                  {initialsOf(user?.name)}
                </Avatar>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{user?.name ?? 'Usuário'}</TooltipContent>
          </Tooltip>
        </UserDropdown>
      )}
      <button
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
        className={cn(
          'flex cursor-pointer items-center gap-2 rounded-[8px] px-2 py-1 text-[11px] transition-colors hover:bg-white/[0.04]',
          collapsed ? 'h-7 justify-center' : '',
        )}
        style={{ color: 'var(--text-mute)' }}
      >
        {collapsed ? (
          <ChevronsRight size={12} />
        ) : (
          <>
            <ChevronsLeft size={12} /> Recolher
          </>
        )}
      </button>
    </div>
  )
}

/**
 * Dropdown do usuário no rodapé da sidebar · padrão DS.
 * Itens: Perfil · Configurações · Tema (segmented) · Suporte · separator · Sair.
 */
function UserDropdown({
  user,
  children,
}: {
  user?: { name?: string; email?: string }
  children: React.ReactNode
}) {
  const auth = useAuth()

  const handleLogout = () => {
    void auth.signoutRedirect?.().catch(() => {
      auth.removeUser?.()
      window.location.assign('/')
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" className="w-64">
        <DropdownMenuLabel>{user?.name ?? 'Usuário'}</DropdownMenuLabel>
        {user?.email && (
          <div
            className="mono px-2 pb-1 text-[10px]"
            style={{ color: 'var(--text-mute)' }}
          >
            {user.email}
          </div>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserIcon size={13} /> Perfil
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings size={13} /> Configurações
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LifeBuoy size={13} /> Suporte
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div
          className="flex items-center justify-between gap-2 px-2 py-1.5"
          onSelect={(e) => e.preventDefault()}
        >
          <span
            className="mono text-[10px] font-semibold uppercase tracking-[1.4px]"
            style={{ color: 'var(--text-mute)' }}
          >
            Tema
          </span>
          <ThemeToggle />
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogout} style={{ color: 'var(--danger)' }}>
          <LogOut size={13} /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Sidebar({
  collapsed,
  onToggle,
  currentPath,
  user,
  onItemClick,
}: {
  collapsed: boolean
  onToggle: () => void
  currentPath: string
  user?: { name?: string; email?: string }
  onItemClick?: () => void
}) {
  return (
    <aside
      onClick={onItemClick}
      className="flex h-full flex-col border-r transition-[width] duration-200"
      style={{ background: 'var(--surface-1)', borderColor: 'var(--line-1)' }}
    >
      <SidebarBrand collapsed={collapsed} />

      {/* Quick action */}
      <div className="px-3 pt-3">
        {!collapsed ? (
          <Button size="sm" className="w-full">
            <Plus size={13} /> Novo
          </Button>
        ) : (
          <Button size="icon" aria-label="Novo" className="w-full">
            <Plus size={14} />
          </Button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        {navGroups.map((g) => (
          <NavGroupBlock
            key={g.id}
            group={g}
            currentPath={currentPath}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <SidebarFooter collapsed={collapsed} onToggle={onToggle} user={user} />
    </aside>
  )
}

// ---------------------------------------------------------------------------
// Top Header
// ---------------------------------------------------------------------------

function TopHeader({
  user,
  onMobileMenuClick,
}: {
  user?: { name?: string; email?: string }
  onMobileMenuClick: () => void
}) {
  return (
    <header
      className="flex shrink-0 items-center justify-between gap-3 border-b px-4 py-2.5 md:px-5"
      style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}
    >
      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={onMobileMenuClick}
        aria-label="Abrir menu"
        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-[10px] md:hidden"
        style={{ color: 'var(--text)' }}
      >
        <Menu size={18} />
      </button>

      {/* Search cmd+k */}
      <button
        type="button"
        className="group hidden flex-1 max-w-md cursor-pointer items-center gap-2 rounded-[10px] border px-3 py-1.5 text-left transition-colors md:flex"
        style={{ background: 'var(--surface-2)', borderColor: 'var(--line-2)' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--line-3)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--line-2)'
        }}
      >
        <Search size={13} style={{ color: 'var(--text-mute)' }} />
        <span className="flex-1 truncate text-[12.5px]" style={{ color: 'var(--text-mute)' }}>
          Buscar tudo · projetos, clientes, comandos…
        </span>
        <span
          className="mono inline-flex items-center gap-0.5 rounded border px-1.5 py-0.5 text-[10px] font-bold"
          style={{
            background: 'var(--surface-1)',
            borderColor: 'var(--line-2)',
            color: 'var(--text-mute)',
          }}
        >
          ⌘K
        </span>
      </button>
      <div className="flex-1 md:hidden" />

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Lúmen AI" title="Lúmen · AI">
          <Sparkles size={14} strokeWidth={1.7} />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Command palette" title="⌘K">
          <Command size={14} strokeWidth={1.7} />
        </Button>
        <div className="relative">
          <Button variant="ghost" size="icon" aria-label="Notificações" title="Notificações">
            <Bell size={14} strokeWidth={1.7} />
          </Button>
        </div>
        <div className="ml-1">
          <UserMenu name={user?.name} email={user?.email} />
        </div>
      </div>
    </header>
  )
}

// ---------------------------------------------------------------------------
// Status bar
// ---------------------------------------------------------------------------

function StatusBar() {
  return (
    <footer
      className="hidden shrink-0 items-center justify-between gap-3 border-t px-5 py-1.5 md:flex"
      style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}
    >
      <div className="mono flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[1.3px]">
        <span className="inline-flex items-center gap-1.5" style={{ color: 'var(--success)' }}>
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full animate-breathe"
            style={{ background: 'var(--success)' }}
          />
          Live · sync ok
        </span>
        <span style={{ color: 'var(--text-mute)' }}>•</span>
        <span style={{ color: 'var(--text-mute)' }}>v0.1 · build dev</span>
      </div>
      <div
        className="mono flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[1.3px]"
        style={{ color: 'var(--text-mute)' }}
      >
        <span>⌘? · atalhos</span>
      </div>
    </footer>
  )
}

// ---------------------------------------------------------------------------
// AppShell · público
// ---------------------------------------------------------------------------

export interface AppShellProps {
  children: React.ReactNode
  user?: { name?: string; email?: string }
}

export function AppShell({ children, user }: AppShellProps) {
  const location = useLocation()
  const router = useRouter()
  const [collapsed, setCollapsed] = useCollapsedPersist()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  // Fecha drawer mobile ao navegar
  React.useEffect(() => {
    return router.subscribe('onResolved', () => setMobileOpen(false))
  }, [router])

  useEscapeKey(mobileOpen, () => setMobileOpen(false))

  return (
    <TooltipProvider delayDuration={120}>
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ background: 'var(--bg)', color: 'var(--text)' }}
    >
      {/* Sidebar desktop */}
      <div
        className="hidden h-full shrink-0 transition-[width] duration-200 md:block"
        style={{ width: collapsed ? 60 : 240 }}
      >
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
          currentPath={location.pathname}
          user={user}
        />
      </div>

      {/* Sidebar mobile · overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMobileOpen(false)}
            className="overlay-strong absolute inset-0"
          />
          <div className="relative z-10 h-full w-64">
            <Sidebar
              collapsed={false}
              onToggle={() => setMobileOpen(false)}
              currentPath={location.pathname}
              user={user}
              onItemClick={() => {
                /* clique geral fecha · controlado via subscribe */
              }}
            />
            <button
              type="button"
              aria-label="Fechar menu"
              onClick={() => setMobileOpen(false)}
              className="absolute -right-9 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full"
              style={{ background: 'var(--surface-2)', color: 'var(--text)' }}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Coluna principal */}
      <div className="flex h-full min-w-0 flex-1 flex-col">
        <TopHeader user={user} onMobileMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8">{children}</div>
        </main>

        <StatusBar />
      </div>
    </div>
    </TooltipProvider>
  )
}
