import * as React from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import {
  Building2,
  Boxes,
  Briefcase,
  ChevronDown,
  Cog,
  CreditCard,
  HardHat,
  Kanban as KanbanIcon,
  LayoutGrid,
  Layers,
  Network,
  Settings,
  ShoppingBag,
  UserCircle2,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * AppShell · sidebar fixa à esquerda + topbar + content.
 *
 * Sidebar com seções colapsáveis:
 *   • CRM (operacional)
 *   • Configurações → CRM (4 entidades)
 *   • Configurações → Empresa (5 entidades)
 *
 * Mobile: hamburger (não implementado nesta v1 · será adicionado quando precisar mobile)
 */

interface NavItem {
  to: string
  label: string
  Icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>
  exact?: boolean
}

interface NavGroup {
  id: string
  label: string
  Icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>
  items: NavItem[]
}

const groups: NavGroup[] = [
  {
    id: 'crm',
    label: 'CRM',
    Icon: KanbanIcon,
    items: [
      { to: '/crm/leads', label: 'Leads', Icon: UserCircle2 },
      { to: '/crm/clientes', label: 'Clientes', Icon: Users },
      { to: '/crm/atendimento', label: 'Atendimento · Pipeline', Icon: KanbanIcon },
      { to: '/crm/propostas', label: 'Propostas · Pipeline', Icon: Briefcase },
    ],
  },
  {
    id: 'settings-crm',
    label: 'Config · CRM',
    Icon: Settings,
    items: [
      { to: '/settings/crm/tipos-propostas', label: 'Tipos de Propostas', Icon: Briefcase },
      { to: '/settings/crm/tipos-pagamentos', label: 'Tipos de Pagamentos', Icon: CreditCard },
      { to: '/settings/crm/pipelines', label: 'Pipelines', Icon: Network },
      { to: '/settings/crm/etapas', label: 'Etapas', Icon: Layers },
    ],
  },
  {
    id: 'settings-empresa',
    label: 'Config · Empresa',
    Icon: Building2,
    items: [
      { to: '/settings/empresa/produtos', label: 'Produtos', Icon: ShoppingBag },
      { to: '/settings/empresa/setores', label: 'Setores', Icon: LayoutGrid },
      { to: '/settings/empresa/tipos-projetos', label: 'Tipos de Projetos', Icon: Boxes },
      { to: '/settings/empresa/funcoes-pessoas', label: 'Funções de Pessoas', Icon: Briefcase },
      { to: '/settings/empresa/empreendimentos', label: 'Empreendimentos', Icon: HardHat },
    ],
  },
]

function NavGroupBlock({ group, currentPath }: { group: NavGroup; currentPath: string }) {
  const hasActive = group.items.some((it) => currentPath.startsWith(it.to))
  const [open, setOpen] = React.useState(hasActive)

  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn(
          'flex w-full items-center justify-between rounded-md px-3 py-2 text-left',
          'text-xs font-semibold uppercase tracking-wider',
          'text-muted-foreground hover:text-foreground hover:bg-accent transition-colors',
        )}
      >
        <span className="inline-flex items-center gap-2">
          <group.Icon size={14} strokeWidth={1.8} />
          {group.label}
        </span>
        <ChevronDown size={14} className={cn('transition-transform', !open && '-rotate-90')} />
      </button>
      {open && (
        <ul className="ml-1 mt-0.5 flex flex-col gap-px">
          {group.items.map((item) => {
            const active = currentPath === item.to || currentPath.startsWith(`${item.to}/`)
            return (
              <li key={item.to}>
                <Link
                  to={item.to as any}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors',
                    active
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-foreground/80 hover:bg-accent hover:text-foreground',
                  )}
                >
                  <item.Icon size={14} strokeWidth={1.8} />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export interface AppShellProps {
  children: React.ReactNode
  user?: { name?: string; email?: string }
}

export function AppShell({ children, user }: AppShellProps) {
  const location = useLocation()
  return (
    <div className="bg-background text-foreground flex min-h-screen">
      {/* Sidebar */}
      <aside className="bg-card sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r md:flex">
        {/* Brand */}
        <div className="border-b px-5 py-4">
          <Link to="/" className="text-primary inline-flex items-baseline gap-2 font-bold">
            <span className="text-lg tracking-tight">TKWS</span>
            <span className="text-muted-foreground text-[10px] font-mono uppercase tracking-widest">
              OS · v0.1
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {groups.map((g) => (
            <NavGroupBlock key={g.id} group={g} currentPath={location.pathname} />
          ))}
        </nav>

        {/* User */}
        {user && (
          <div className="border-t px-3 py-3">
            <div className="bg-muted/40 flex items-center gap-2 rounded-md px-2 py-2">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold">
                {(user.name ?? 'U').slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{user.name ?? 'Usuário'}</div>
                <div className="text-muted-foreground truncate text-xs">{user.email}</div>
              </div>
              <Cog size={14} className="text-muted-foreground" />
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        <div className="mx-auto max-w-7xl px-6 py-6">{children}</div>
      </main>
    </div>
  )
}
