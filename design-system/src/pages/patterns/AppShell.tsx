import { useState } from 'react'
import {
  Bell,
  Box,
  Calendar,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Cog,
  Command,
  Edit3,
  FileText,
  Folder,
  Home,
  Inbox,
  LayoutGrid,
  LifeBuoy,
  MessageSquare,
  Package,
  Plus,
  Search,
  Settings,
  Share2,
  Sparkles,
  TrendingUp,
  User as UserIcon,
  Users,
  Wallet,
  Wrench,
} from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { KpiMini } from '@/components/tkws/kpi'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Kbd, KbdCombo } from '@/components/ui/kbd'
import { cn, formatCurrency } from '@/lib/utils'
import type { AIPrompt } from '@/lib/prompts'

// ============================================================================
// Sidebar data
// ============================================================================

interface NavLink {
  id: string
  label: string
  icon: React.ReactNode
  badge?: { label: string; tone: 'brand' | 'success' | 'warning' | 'danger' | 'neutral' }
  active?: boolean
}

interface NavGroup {
  label: string
  items: NavLink[]
}

const sidebarGroups: NavGroup[] = [
  {
    label: 'Operação',
    items: [
      { id: 'dash', label: 'Dashboard', icon: <Home size={14} /> },
      { id: 'projetos', label: 'Projetos', icon: <Folder size={14} />, badge: { label: '43', tone: 'brand' }, active: true },
      { id: 'clientes', label: 'Clientes', icon: <Users size={14} />, badge: { label: '128', tone: 'neutral' } },
      { id: 'fornec', label: 'Fornecedores', icon: <Wrench size={14} /> },
      { id: 'catalogo', label: 'Catálogo', icon: <Package size={14} /> },
    ],
  },
  {
    label: 'Comunicação',
    items: [
      { id: 'inbox', label: 'Inbox', icon: <Inbox size={14} />, badge: { label: '3', tone: 'danger' } },
      { id: 'chat', label: 'Conversas', icon: <MessageSquare size={14} /> },
      { id: 'agenda', label: 'Agenda', icon: <Calendar size={14} /> },
    ],
  },
  {
    label: 'Financeiro',
    items: [
      { id: 'fluxo', label: 'Fluxo de caixa', icon: <Wallet size={14} /> },
      { id: 'docs', label: 'Documentos', icon: <FileText size={14} /> },
      { id: 'perf', label: 'Performance', icon: <TrendingUp size={14} /> },
    ],
  },
]

// Breadcrumb path
const crumbs = [
  { label: 'Projetos', href: '#' },
  { label: 'Squad Orion', href: '#' },
  { label: 'Yachthouse 2104', current: true },
]

// Page tabs (inside content)
const pageTabs = [
  { id: 'overview', label: 'Visão geral' },
  { id: 'briefing', label: 'Briefing' },
  { id: 'budget', label: 'Orçamento' },
  { id: 'finance', label: 'Financeiro' },
  { id: 'obra', label: 'Obra' },
  { id: 'team', label: 'Equipe' },
]

// Sub-nav pills (inside overview)
const subnavPills = [
  { id: 'all', label: 'Tudo', count: 18 },
  { id: 'recent', label: 'Recentes', count: 4 },
  { id: 'pending', label: 'Aguardando você', count: 2 },
  { id: 'mine', label: 'Meus', count: 7 },
]

const recentDocs = [
  { name: 'Orçamento revisão 02', meta: 'Atualizado há 12 min · Lucas Z.', tone: 'success' as const, status: 'Aprovado' },
  { name: 'Render living · final', meta: 'Atualizado hoje · Ana V.', tone: 'brand' as const, status: 'Em revisão' },
  { name: 'Cronograma de obra', meta: 'Atraso reportado · 8 dias', tone: 'danger' as const, status: 'Atrasado' },
  { name: 'Contrato assinado', meta: '14/03 às 09:42 · Cliente', tone: 'success' as const, status: 'Concluído' },
]

const prompt: AIPrompt = {
  componente: 'Pattern · App Shell completo',
  import: '// Composição: TopHeader + Sidebar colapsável + Breadcrumb + PageHeader + Tabs underline + Sub-nav pills + Content + StatusBar',
  contexto:
    'Tela "shell" completa do TKWS OS. Padrão para qualquer view de operação. 6 níveis de navegação em ordem: 1) global (sidebar + topbar) → 2) breadcrumb (hierarquia) → 3) page title + actions → 4) tabs underline (sub-seções) → 5) sub-nav pills (filtros rápidos) → 6) toolbar inline. Sidebar colapsável com persist no Zustand.',
  quandoUsar: [
    'Layout principal de QUALQUER tela de operação do TKWS OS',
    'Quando precisa de navegação multi-nível em um único enquadramento',
    'Para demonstrar visão "shell" do produto',
  ],
  props: [],
  antiPatterns: [
    'Esconder breadcrumb · usuário fica sem âncora em hierarquias profundas',
    'Mais de 7 tabs underline · vire sidebar de seções',
    'Sidebar fixa sem opção de colapso · trava em telas pequenas',
    'Misturar nav primária no topo (Navbar) E lateral (Sidebar) · escolha um',
  ],
  exemplo: `// Layout cocomposed:
<AppShell>
  <TopHeader />     {/* nav global · search · cmd+k · user */}
  <Sidebar />       {/* nav primária · grupos */}
  <ContentArea>
    <Breadcrumb /> {/* nav hierárquica */}
    <PageHeader /> {/* nav contextual */}
    <Tabs />       {/* nav de sub-seção */}
    <SubNavPills />{/* filtros rápidos */}
    {/* content */}
  </ContentArea>
  <StatusBar />     {/* sync · presence */}
</AppShell>`,
  relacionados: ['Sidebar', 'TopHeader', 'Breadcrumb', 'Tabs', 'Command Palette'],
}

export function AppShellPattern() {
  const [collapsed, setCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [activePill, setActivePill] = useState('all')

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        num="P00"
        category="Pattern · App Shell"
        title="App Shell completo"
        italic="6 níveis de navegação"
        description="Layout master do TKWS OS. Header + Sidebar colapsável + Breadcrumb + Tabs + Sub-nav pills + Status bar. Padrão para qualquer tela de operação."
        tag="tela completa · interativa"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="App Shell · clique nos níveis para interagir" />
      <Showcase padding="none" bg="bg">
        <div
          className="overflow-hidden rounded-[10px]"
          style={{ background: 'var(--bg)', height: 720 }}
        >
          <AppShellMockup
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed((c) => !c)}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            activePill={activePill}
            onPillChange={setActivePill}
          />
        </div>
      </Showcase>

      <SubHead num="B" title="Anatomia · os 6 níveis de navegação" />
      <Showcase>
        <ol className="grid gap-3">
          {[
            { n: '1', lbl: 'Nav global (Sidebar + TopHeader)', desc: 'Sempre visível · 4-7 grupos de até 8 items · search ⌘K · user menu' },
            { n: '2', lbl: 'Breadcrumb', desc: 'Hierarquia do registro atual · clicável até o item · último é página atual' },
            { n: '3', lbl: 'Page Header', desc: 'Título Fraunces + crumb mono · actions à direita (Editar, Compartilhar)' },
            { n: '4', lbl: 'Tabs underline', desc: 'Sub-seções do registro · 5-7 tabs · estado na URL via search params' },
            { n: '5', lbl: 'Sub-nav pills', desc: 'Filtros rápidos dentro da tab · "Tudo · Recentes · Pendentes"' },
            { n: '6', lbl: 'Toolbar / Filter sidebar', desc: 'Search + filtros + view switcher · também na URL' },
          ].map((step) => (
            <li
              key={step.n}
              className="grid grid-cols-[28px_1fr] items-start gap-3 rounded-[10px] border p-3"
              style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)' }}
            >
              <span
                className="mono inline-flex h-6 w-6 items-center justify-center rounded-full font-bold"
                style={{ background: 'var(--brand)', color: 'var(--bg)' }}
              >
                {step.n}
              </span>
              <div>
                <div className="text-[13.5px] font-semibold" style={{ color: 'var(--text)' }}>
                  {step.lbl}
                </div>
                <div className="mt-0.5 text-[12.5px]" style={{ color: 'var(--text-soft)' }}>
                  {step.desc}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Showcase>
    </div>
  )
}

// ============================================================================
// AppShell Mockup
// ============================================================================

function AppShellMockup({
  collapsed,
  onToggleCollapse,
  activeTab,
  onTabChange,
  activePill,
  onPillChange,
}: {
  collapsed: boolean
  onToggleCollapse: () => void
  activeTab: string
  onTabChange: (t: string) => void
  activePill: string
  onPillChange: (p: string) => void
}) {
  return (
    <div className="grid h-full" style={{ gridTemplateColumns: collapsed ? '60px 1fr' : '240px 1fr' }}>
      {/* SIDEBAR */}
      <AppSidebar collapsed={collapsed} onToggle={onToggleCollapse} />

      {/* MAIN COLUMN */}
      <div className="flex h-full flex-col overflow-hidden">
        {/* TOP HEADER */}
        <AppTopHeader />

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto">
          {/* BREADCRUMB */}
          <div
            className="border-b px-6 py-2.5"
            style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}
          >
            <Breadcrumb>
              <BreadcrumbList>
                {crumbs.map((c, i) => (
                  <BreadcrumbItem key={c.label}>
                    {i > 0 && <BreadcrumbSeparator />}
                    {c.current ? (
                      <BreadcrumbPage>{c.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={c.href}>{c.label}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* PAGE HEADER */}
          <div className="px-6 pt-7 pb-5" style={{ background: 'var(--surface-1)' }}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar size="lg" square style={{ background: 'var(--purple)' }}>
                  <AvatarFallback>YH</AvatarFallback>
                </Avatar>
                <div>
                  <div
                    className="mono text-[10.5px] font-semibold uppercase tracking-[1.3px]"
                    style={{ color: 'var(--text-mute)' }}
                  >
                    PROJETO · #2410 · REV.2
                  </div>
                  <h1
                    className="serif mt-1 text-[30px] font-normal leading-[1.1]"
                    style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
                  >
                    Yachthouse 2104
                    <em className="italic font-normal" style={{ color: 'var(--text-soft)' }}>
                      {' '}Família Andrade
                    </em>
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge tone="warning" pulse>
                      Em obra · atrasado 8d
                    </Badge>
                    <Badge tone="purple">Squad Orion</Badge>
                    <span className="mono text-[11.5px]" style={{ color: 'var(--text-mute)' }}>
                      280 m² · BC/SC · entrega 15/06
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="outline" size="sm">
                  <Share2 size={12} /> Compartilhar
                </Button>
                <Button size="sm">
                  <Edit3 size={12} /> Editar
                </Button>
              </div>
            </div>
          </div>

          {/* TABS UNDERLINE */}
          <div
            className="sticky top-0 z-10 border-b px-6"
            style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}
          >
            <Tabs value={activeTab} onValueChange={onTabChange}>
              <TabsList variant="underline" className="!border-b-0">
                {pageTabs.map((t) => (
                  <TabsTrigger key={t.id} value={t.id} underline>
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* CONTENT */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid gap-5">
                {/* SUB-NAV PILLS */}
                <div className="flex items-center justify-between gap-3">
                  <div
                    className="inline-flex items-center gap-0.5 rounded-[12px] border p-1"
                    style={{ background: 'var(--surface-2)', borderColor: 'var(--line-2)' }}
                  >
                    {subnavPills.map((p) => {
                      const isActive = activePill === p.id
                      return (
                        <button
                          key={p.id}
                          onClick={() => onPillChange(p.id)}
                          className={cn(
                            'cursor-pointer rounded-[8px] px-3.5 py-2 text-[13px] font-semibold transition-all',
                          )}
                          style={{
                            background: isActive ? 'var(--brand)' : 'transparent',
                            color: isActive ? 'var(--bg)' : 'var(--text-mute)',
                            boxShadow: isActive ? '0 1px 4px var(--brand-soft)' : undefined,
                          }}
                        >
                          {p.label}
                          <span
                            className="mono ml-1.5 text-[10px] font-bold"
                            style={{ color: isActive ? 'var(--bg)' : 'var(--text-mute)' }}
                          >
                            {p.count}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      icon={<Search size={13} />}
                      placeholder="Buscar nesta aba…"
                      className="!h-9 !text-[13px]"
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" aria-label="View">
                          <LayoutGrid size={13} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Alternar visualização · <Kbd>V</Kbd></TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                {/* KPI STRIP */}
                <div className="grid grid-cols-4 gap-3 max-[760px]:grid-cols-2">
                  <KpiMini label="Contrato" value="R$ 12,5M" hint="firmado 14/03" tone="brand" />
                  <KpiMini label="Margem" value="31,2%" hint="alvo 30%" tone="success" />
                  <KpiMini label="Progresso" value="65%" hint="8d atraso" tone="warning" />
                  <KpiMini label="NPS cliente" value="9,2" hint="média alta" tone="success" />
                </div>

                {/* Card grande · próximo passo */}
                <Card accent="brand">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-[10px]"
                        style={{ background: 'var(--brand)', color: 'var(--bg)' }}
                      >
                        <Sparkles size={18} strokeWidth={1.7} />
                      </span>
                      <div>
                        <div
                          className="mono text-[10px] font-bold uppercase tracking-[1.6px]"
                          style={{ color: 'var(--brand)' }}
                        >
                          Sugestão Lúmen · Próximo passo
                        </div>
                        <div
                          className="serif mt-1 text-[18px] font-normal"
                          style={{ color: 'var(--text)' }}
                        >
                          Apresentar alternativa de granito hoje
                        </div>
                        <p
                          className="mt-1.5 text-[13px] leading-relaxed"
                          style={{ color: 'var(--text-soft)' }}
                        >
                          Marmoraria Itajaí cotou 18% mais barato · prazo melhor. Use antes da reunião de quinta.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">Resolver</Button>
                      <Button variant="ghost" size="sm">Depois</Button>
                    </div>
                  </div>
                </Card>

                {/* Lista de docs */}
                <Card>
                  <CardContent className="!p-0">
                    <ul>
                      {recentDocs.map((d, i) => (
                        <li
                          key={i}
                          className="grid cursor-pointer grid-cols-[36px_1fr_auto] items-center gap-3 border-b px-4 py-3 transition-colors last:border-0 hover:bg-[var(--surface-2)]"
                          style={{ borderColor: 'var(--line-1)' }}
                        >
                          <span
                            className="flex h-9 w-9 items-center justify-center rounded-[8px]"
                            style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}
                          >
                            <FileText size={14} />
                          </span>
                          <div>
                            <div className="text-[13.5px] font-semibold" style={{ color: 'var(--text)' }}>
                              {d.name}
                            </div>
                            <div className="mono mt-0.5 text-[10.5px]" style={{ color: 'var(--text-mute)' }}>
                              {d.meta}
                            </div>
                          </div>
                          <Badge tone={d.tone}>{d.status}</Badge>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Mini progress */}
                <Card>
                  <div className="mono mb-3 text-[10.5px] font-semibold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                    Etapas
                  </div>
                  <div className="grid gap-3">
                    {[
                      { l: 'Briefing', v: 100, tone: 'success' as const },
                      { l: 'Orçamento', v: 100, tone: 'success' as const },
                      { l: 'Execução · obra', v: 65, tone: 'warning' as const },
                      { l: 'Decoração', v: 12, tone: 'brand' as const },
                    ].map((s) => (
                      <div key={s.l}>
                        <div className="flex items-center justify-between text-[12px]">
                          <span style={{ color: 'var(--text-soft)' }}>{s.l}</span>
                          <span className="mono font-bold" style={{ color: 'var(--text)' }}>{s.v}%</span>
                        </div>
                        <div className="mt-1.5">
                          <Progress value={s.v} tone={s.tone} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab !== 'overview' && (
              <Card>
                <CardContent>
                  <div className="serif text-[20px] font-normal" style={{ color: 'var(--text)' }}>
                    Conteúdo da aba <em className="italic" style={{ color: 'var(--brand)' }}>{pageTabs.find((t) => t.id === activeTab)?.label}</em>
                  </div>
                  <p className="mt-2 text-[13px]" style={{ color: 'var(--text-soft)' }}>
                    Cada aba tem sua própria composição de componentes · use o padrão de Showcase / patterns.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* fund extra · respiro inferior */}
            <div className="h-12" />
          </div>
        </div>

        {/* STATUS BAR */}
        <AppStatusBar />
      </div>
    </div>
  )
}

// ============================================================================
// Sidebar
// ============================================================================

function AppSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <aside
      className="flex h-full flex-col border-r transition-all duration-200"
      style={{ background: 'var(--surface-1)', borderColor: 'var(--line-1)' }}
    >
      {/* Brand */}
      <div
        className="flex items-center justify-between border-b px-4 py-3"
        style={{ borderColor: 'var(--line-1)' }}
      >
        {!collapsed ? (
          <div className="flex items-baseline gap-2">
            <span
              className="serif text-[18px] font-normal"
              style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
            >
              TKWS <em className="italic" style={{ color: 'var(--brand)' }}>OS</em>
            </span>
            <span
              className="mono rounded px-1.5 py-0.5 text-[9px] font-extrabold tracking-widest"
              style={{ background: 'var(--brand)', color: 'var(--bg)' }}
            >
              v1
            </span>
          </div>
        ) : (
          <span
            className="serif text-[20px] font-normal italic"
            style={{ color: 'var(--brand)', letterSpacing: '-0.02em' }}
          >
            T
          </span>
        )}
      </div>

      {/* Quick actions */}
      <div className="px-3 pt-3">
        {!collapsed ? (
          <Button size="sm" className="w-full">
            <Plus size={13} /> Novo projeto
          </Button>
        ) : (
          <Button size="icon" aria-label="Novo projeto" className="w-full">
            <Plus size={14} />
          </Button>
        )}
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto py-3">
        {sidebarGroups.map((g) => (
          <div key={g.label} className="px-3 pt-2">
            {!collapsed && (
              <div
                className="mono mb-1 px-2 text-[9.5px] font-semibold uppercase tracking-[1.4px]"
                style={{ color: 'var(--text-mute)' }}
              >
                {g.label}
              </div>
            )}
            <ul className="flex flex-col gap-px">
              {g.items.map((it) => (
                <li key={it.id}>
                  {collapsed ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={cn(
                            'flex h-9 w-full cursor-pointer items-center justify-center rounded-[8px] transition-colors',
                            'hover:bg-white/[0.06]'
                          )}
                          style={{
                            background: it.active ? 'var(--brand-soft)' : 'transparent',
                            color: it.active ? 'var(--brand)' : 'var(--text-soft)',
                          }}
                        >
                          {it.icon}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right">{it.label}</TooltipContent>
                    </Tooltip>
                  ) : (
                    <button
                      className={cn(
                        'grid w-full grid-cols-[20px_1fr_auto] items-center gap-2.5 rounded-[8px] px-2.5 py-1.5 text-left text-[13px] font-medium transition-colors',
                        'hover:bg-white/[0.06]'
                      )}
                      style={{
                        background: it.active ? 'var(--brand-soft)' : 'transparent',
                        color: it.active ? 'var(--brand)' : 'var(--text-soft)',
                      }}
                    >
                      <span className="flex items-center justify-center">{it.icon}</span>
                      <span>{it.label}</span>
                      {it.badge && <Badge tone={it.badge.tone}>{it.badge.label}</Badge>}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer · settings + user */}
      <div
        className="flex flex-col gap-2 border-t p-3"
        style={{ borderColor: 'var(--line-1)' }}
      >
        {!collapsed ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-[8px] px-2 py-1.5 transition-colors hover:bg-white/[0.06]"
                >
                  <Avatar size="sm" style={{ background: 'var(--purple)' }}>
                    <AvatarFallback>AP</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 text-left leading-tight">
                    <div className="truncate text-[12.5px] font-semibold" style={{ color: 'var(--text)' }}>
                      Allysson P.
                    </div>
                    <div className="mono truncate text-[10px]" style={{ color: 'var(--text-mute)' }}>
                      Diretor · WS Group
                    </div>
                  </div>
                  <ChevronRight size={12} style={{ color: 'var(--text-mute)' }} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>WS Group</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><UserIcon size={13} /> Perfil</DropdownMenuItem>
                <DropdownMenuItem><Settings size={13} /> Configurações</DropdownMenuItem>
                <DropdownMenuItem><LifeBuoy size={13} /> Suporte</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem style={{ color: 'var(--danger)' }}>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              onClick={onToggle}
              className="flex items-center gap-2 rounded-[8px] px-2 py-1 text-[11px] transition-colors hover:bg-white/[0.04]"
              style={{ color: 'var(--text-mute)' }}
            >
              <ChevronsLeft size={12} /> Recolher
            </button>
          </>
        ) : (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="flex h-9 w-full cursor-pointer items-center justify-center rounded-[8px] hover:bg-white/[0.06]">
                  <Avatar size="sm" style={{ background: 'var(--purple)' }}>
                    <AvatarFallback>AP</AvatarFallback>
                  </Avatar>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Allysson P. · Diretor</TooltipContent>
            </Tooltip>
            <button
              onClick={onToggle}
              aria-label="Expandir"
              className="flex h-7 w-full cursor-pointer items-center justify-center rounded-[6px] hover:bg-white/[0.04]"
              style={{ color: 'var(--text-mute)' }}
            >
              <ChevronsRight size={12} />
            </button>
          </>
        )}
      </div>
    </aside>
  )
}

// ============================================================================
// Top Header
// ============================================================================

function AppTopHeader() {
  return (
    <header
      className="flex shrink-0 items-center justify-between gap-4 border-b px-5 py-2.5"
      style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}
    >
      {/* Cmd K search */}
      <button
        className="group flex flex-1 max-w-md cursor-pointer items-center gap-2 rounded-[10px] border px-3 py-1.5 text-left transition-colors"
        style={{ background: 'var(--surface-2)', borderColor: 'var(--line-2)' }}
      >
        <Search size={13} style={{ color: 'var(--text-mute)' }} />
        <span className="flex-1 text-[12.5px]" style={{ color: 'var(--text-mute)' }}>
          Buscar tudo · projetos, clientes, comandos…
        </span>
        <KbdCombo keys={['⌘', 'K']} />
      </button>

      {/* Actions à direita */}
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Lúmen AI">
              <Sparkles size={14} strokeWidth={1.7} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Lúmen · AI assistente · <Kbd>⌘L</Kbd></TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Command palette">
              <Command size={14} strokeWidth={1.7} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Command palette · <KbdCombo keys={['⌘', 'K']} /></TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              <Button variant="ghost" size="icon" aria-label="Notificações">
                <Bell size={14} strokeWidth={1.7} />
              </Button>
              <span
                className="mono absolute top-1 right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold"
                style={{ background: 'var(--danger)', color: '#fff' }}
              >
                3
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>3 notificações · 1 crítica</TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="ml-1 inline-flex cursor-pointer items-center gap-2 rounded-full border px-1 py-1 transition-colors"
              style={{ background: 'var(--surface-2)', borderColor: 'var(--line-2)' }}
            >
              <Avatar size="sm" style={{ background: 'var(--purple)' }}>
                <AvatarFallback>AP</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Allysson Pereira</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><UserIcon size={13} /> Meu perfil</DropdownMenuItem>
            <DropdownMenuItem><Cog size={13} /> Preferências</DropdownMenuItem>
            <DropdownMenuItem><Box size={13} /> Workspaces</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem style={{ color: 'var(--danger)' }}>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

// ============================================================================
// Status bar
// ============================================================================

function AppStatusBar() {
  return (
    <footer
      className="flex shrink-0 items-center justify-between gap-3 border-t px-5 py-1.5"
      style={{ borderColor: 'var(--line-1)', background: 'var(--surface-1)' }}
    >
      <div className="mono flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[1.3px]">
        <span style={{ color: 'var(--success)' }} className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: 'var(--success)', animation: 'alive-breathe 2.2s ease-in-out infinite' }}
          />
          Live · sync ok
        </span>
        <span style={{ color: 'var(--text-mute)' }}>•</span>
        <span style={{ color: 'var(--text-mute)' }}>v1.0.42 · build #821</span>
      </div>
      <div className="mono flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[1.3px]" style={{ color: 'var(--text-mute)' }}>
        <span>Salvo há 3s</span>
        <span>•</span>
        <span className="inline-flex items-center gap-1">
          <Avatar size="sm" style={{ background: 'var(--brand)', height: 14, width: 14, fontSize: 8 }}>
            <AvatarFallback>LZ</AvatarFallback>
          </Avatar>
          Lucas Z. editando
        </span>
        <span>•</span>
        <span>⌘? atalhos</span>
      </div>
    </footer>
  )
}
