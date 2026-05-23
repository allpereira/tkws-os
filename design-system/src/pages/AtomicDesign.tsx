import * as React from 'react'
import { Atom, Beaker, BookOpen, Layers, LayoutTemplate } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'

/**
 * Documentação da taxonomia Atomic Design aplicada ao TKWS OS.
 *
 * Referência: Brad Frost · "Atomic Design"
 * https://atomicdesign.bradfrost.com/
 */

interface AtomicLevel {
  num: string
  label: string
  italic: string
  description: string
  icon: React.ReactNode
  color: string
  importPath: string
  components: ComponentEntry[]
}

interface ComponentEntry {
  name: string
  description: string
  /** Caminho atual no repo · ex: 'ui/button' ou 'tkws/header' */
  file: string
}

const levels: AtomicLevel[] = [
  {
    num: '01',
    label: 'Atoms',
    italic: 'primitivos indivisíveis',
    description:
      'Os tijolos. Não compõem outros componentes — só usam tokens. Cada átomo tem uma única responsabilidade visual ou de input. São stand-alone e reutilizados em todos os níveis acima.',
    icon: <Atom size={20} />,
    color: 'var(--brand)',
    importPath: '@/components/atoms',
    components: [
      { name: 'Button', description: 'Ação primária · 5 variantes · 4 tamanhos', file: 'ui/button.tsx' },
      { name: 'Badge', description: 'Status/taxonomia · 7 tons · pill', file: 'ui/badge.tsx' },
      { name: 'Input', description: 'Caixa de texto base · h 40px', file: 'ui/input.tsx' },
      { name: 'Textarea', description: 'Multi-linha · min 90px · resize-y', file: 'ui/textarea.tsx' },
      { name: 'Label', description: 'Rótulo mono 10.5px uppercase', file: 'ui/label.tsx' },
      { name: 'Checkbox', description: '18×18 radius 5 · check via radix', file: 'ui/checkbox.tsx' },
      { name: 'Switch', description: '36×20 toggle brand quando on', file: 'ui/switch.tsx' },
      { name: 'Slider', description: 'Range thumb 18px com brand border', file: 'ui/slider.tsx' },
      { name: 'Spinner', description: 'Ring/dots · 4 tamanhos · semantic tones', file: 'ui/spinner.tsx' },
      { name: 'Kbd', description: 'Tecla mono · com inset shadow', file: 'ui/kbd.tsx' },
      { name: 'Separator', description: 'Divider 1px line-1 horizontal ou vertical', file: 'ui/separator.tsx' },
      { name: 'Skeleton', description: 'Placeholder shimmer para loading', file: 'ui/skeleton.tsx' },
      { name: 'Progress', description: 'Bar 6px com tone semantic', file: 'ui/progress.tsx' },
      { name: 'Toggle', description: 'Botão on/off · brand quando ativo', file: 'ui/toggle.tsx' },
      { name: 'AspectRatio', description: 'Container com razão fixa via radix', file: 'ui/aspect-ratio.tsx' },
      { name: 'ScrollArea', description: 'Scrollbar customizada · brand thumb', file: 'ui/scroll-area.tsx' },
    ],
  },
  {
    num: '02',
    label: 'Molecules',
    italic: 'composições simples',
    description:
      'Composição de 2+ átomos em uma unidade funcional menor. Card = surface + título + descrição + ações. Tabs = lista + triggers + content. Field = label + input + hint. Molecules têm propósito específico mas não orquestram lógica complexa.',
    icon: <Beaker size={20} />,
    color: 'var(--purple)',
    importPath: '@/components/molecules',
    components: [
      { name: 'Card · Header · Content · Footer', description: 'Container universal · surface-1 · radius 14', file: 'ui/card.tsx' },
      { name: 'Avatar · AvatarGroup', description: '4 tamanhos · sobreposição com border externa', file: 'ui/avatar.tsx' },
      { name: 'Tabs · pill / underline', description: 'Lista + triggers + content via radix', file: 'ui/tabs.tsx' },
      { name: 'ToggleGroup', description: 'Bordas fundidas · multi ou single', file: 'ui/toggle.tsx' },
      { name: 'ButtonGroup', description: 'Botões fundidos em barra', file: 'ui/button-group.tsx' },
      { name: 'Breadcrumb', description: 'Mono uppercase · chevron separadores', file: 'ui/breadcrumb.tsx' },
      { name: 'Pagination', description: 'Páginas + ellipsis + prev/next', file: 'ui/pagination.tsx' },
      { name: 'Tooltip', description: 'Hint inverted (bg text, color bg)', file: 'ui/tooltip.tsx' },
      { name: 'Popover', description: 'Conteúdo rico · surface-2 · line-3', file: 'ui/popover.tsx' },
      { name: 'HoverCard', description: 'Preview sem sair do contexto', file: 'ui/hover-card.tsx' },
      { name: 'Alert', description: 'Notif inline · 5 tons · ícone box 26×26', file: 'ui/alert.tsx' },
      { name: 'Banner', description: 'Faixa global top/bottom', file: 'ui/banner.tsx' },
      { name: 'EmptyState', description: 'Vazio · ícone + título + ação', file: 'ui/empty-state.tsx' },
      { name: 'GoalRing', description: 'Ring SVG com % no centro', file: 'ui/goal-ring.tsx' },
      { name: 'Clipboard', description: 'Botão copy com feedback', file: 'ui/clipboard.tsx' },
      { name: 'Rating', description: '5 estrelas brand · half allowed', file: 'ui/rating.tsx' },
      { name: 'Field · FieldHint', description: 'Label + input + hint stacking', file: 'ui/input.tsx' },
      { name: 'FileInput', description: 'Dropzone + lista + progresso', file: 'ui/file-input.tsx' },
      { name: 'InputOTP', description: 'Slots 6 dígitos com paste', file: 'ui/input-otp.tsx' },
      { name: 'NumberInput', description: 'Spinner ± com formato Intl', file: 'ui/number-input.tsx' },
      { name: 'PhoneInput', description: 'BR mask (47) 98xxx-xxxx', file: 'ui/phone-input.tsx' },
      { name: 'MaskedInputs', description: 'CPF · CNPJ · CEP · RG · Plate · Money', file: 'ui/masked-input.tsx' },
      { name: 'InputAffix', description: 'Prefix/suffix em bandas surface-3', file: 'ui/masked-input.tsx' },
      { name: 'MoneyDisplay', description: 'Fraunces 32px ao vivo', file: 'ui/masked-input.tsx' },
      { name: 'RadioGroup · RadioCard', description: 'Seleção única visual', file: 'ui/radio-group.tsx' },
      { name: 'CheckCards', description: 'Multi-seleção em cards', file: 'ui/check-cards.tsx' },
      { name: 'TagInput', description: 'Chips dentro do campo · enter cria', file: 'ui/tag-input.tsx' },
      { name: 'InlineEdit', description: 'Célula editável · ✎ no hover', file: 'ui/inline-edit.tsx' },
      { name: 'Collapsible', description: 'Reveal/esconder uma seção', file: 'ui/collapsible.tsx' },
      { name: 'Form (RHF + Zod)', description: 'FormField + FormControl + FormMessage', file: 'ui/form.tsx' },
      { name: 'ListGroup', description: 'Lista vertical com hover brand-soft', file: 'ui/list-group.tsx' },
      { name: 'Resizable', description: 'Painéis ajustáveis com handle', file: 'ui/resizable.tsx' },
      { name: 'TkwsHeader · Subheader', description: 'Hierarquia editorial de página', file: 'tkws/header.tsx' },
      { name: 'KpiHero · KpiMini', description: 'Indicador KPI · series + delta', file: 'tkws/kpi.tsx' },
      { name: 'WizardSteps', description: 'Stepper horizontal · 5 estados', file: 'tkws/wizard-steps.tsx' },
      { name: 'Timeline', description: 'Eventos com bullet · vertical', file: 'tkws/timeline.tsx' },
      { name: 'LeadScore', description: 'CRM · score visual 0-100', file: 'tkws/crm-lead-score.tsx' },
      { name: 'ChannelBar', description: 'CRM · barra de canais de origem', file: 'tkws/crm-channel-bar.tsx' },
      { name: 'StageStepper', description: 'CRM · etapas do funil', file: 'tkws/crm-stage-stepper.tsx' },
      { name: 'DealCard', description: 'CRM · card de oportunidade', file: 'tkws/crm-deal-card.tsx' },
    ],
  },
  {
    num: '03',
    label: 'Organisms',
    italic: 'seções complexas',
    description:
      'Composição de molecules + atoms em seções autocontidas com comportamento próprio. Dialog tem overlay + content + close + header + body + footer · Kanban tem múltiplas colunas drag-and-drop · NotificationBell tem bell + popover + tabs + grouped rows. Organisms frequentemente são stateful.',
    icon: <Layers size={20} />,
    color: 'var(--success)',
    importPath: '@/components/organisms',
    components: [
      { name: 'Dialog · AlertDialog', description: 'Modais centrais com overlay + foot', file: 'ui/dialog.tsx, alert-dialog.tsx' },
      { name: 'Sheet · Drawer', description: 'Painéis laterais (sheet) e bottom (vaul)', file: 'ui/sheet.tsx, drawer.tsx' },
      { name: 'DropdownMenu', description: 'Menu vertical com items, kbd, danger', file: 'ui/dropdown-menu.tsx' },
      { name: 'ContextMenu', description: 'Clique-direito · mesma anatomia do dropdown', file: 'ui/context-menu.tsx' },
      { name: 'Menubar', description: 'Menu horizontal File/Edit/View', file: 'ui/menubar.tsx' },
      { name: 'NavigationMenu', description: 'Mega menu agrupado · radix', file: 'ui/navigation-menu.tsx' },
      { name: 'Select', description: 'Trigger + content + items · radix', file: 'ui/select.tsx' },
      { name: 'Command Palette', description: 'cmdk · ⌘K com busca + grupos + kbd', file: 'ui/command.tsx' },
      { name: 'Accordion', description: 'Multi-item expansível', file: 'ui/accordion.tsx' },
      { name: 'Calendar · Datepicker', description: 'react-day-picker v9 + TKWS theme', file: 'ui/calendar.tsx' },
      { name: 'Table', description: 'Header + body + rows + cells · density', file: 'ui/table.tsx' },
      { name: 'ChartContainer · Recharts', description: 'Wrapper com config + tooltip + legend', file: 'ui/chart.tsx' },
      { name: 'Lightbox', description: 'Gallery overlay full-screen', file: 'ui/lightbox.tsx' },
      { name: 'Sidebar (app primitive)', description: 'Sidebar genérica · collapsable', file: 'ui/sidebar.tsx' },
      { name: 'AI Lumen', description: 'Painel de chat com IA · sticky', file: 'tkws/ai-lumen.tsx' },
      { name: 'BulkActionBar', description: 'Toolbar com count + ações em massa', file: 'tkws/bulk-action-bar.tsx' },
      { name: 'CategoryTree', description: 'Árvore de categorias do catálogo', file: 'tkws/category-tree.tsx' },
      { name: 'Chat', description: 'Conversa síncrona · bubbles + composer', file: 'tkws/chat.tsx' },
      { name: 'ChecklistWidget', description: 'Floating widget de primeiros passos', file: 'tkws/checklist-widget.tsx' },
      { name: 'Coachmark', description: 'Spotlight + balão · feature nova', file: 'tkws/coachmark.tsx' },
      { name: 'SalesFunnel (CRM)', description: 'Funil em estágios com %', file: 'tkws/crm-pipeline.tsx' },
      { name: 'DetailHero', description: 'Hero de tela detalhe com capa + meta', file: 'tkws/detail-hero.tsx' },
      { name: 'FilterSidebar', description: 'Facets com contagem · multi-section', file: 'tkws/filter-sidebar.tsx' },
      { name: 'Gantt', description: 'Cronograma projeto × tempo', file: 'tkws/gantt.tsx' },
      { name: 'Kanban', description: 'Board drag-and-drop multi-coluna', file: 'tkws/kanban.tsx' },
      { name: 'NotificationBell', description: 'Sino · popover · tabs · grupos', file: 'tkws/notification-bell.tsx' },
      { name: 'ProductCard', description: 'Card de produto · 3 variantes (default/featured/list)', file: 'tkws/product-card.tsx' },
      { name: 'RichList', description: 'Lista editorial com thumb + progresso', file: 'tkws/rich-list.tsx' },
      { name: 'TransferList', description: 'Dual-pane com busca + mover items', file: 'tkws/transfer-list.tsx' },
      { name: 'Charts · VerticalBar, Donut, Line, Heatmap', description: 'Gráficos editoriais sem Recharts', file: 'tkws/charts.tsx' },
    ],
  },
  {
    num: '04',
    label: 'Templates',
    italic: 'estrutura de página',
    description:
      'Estruturas reutilizáveis de página · combinam organisms em layouts. Templates definem ONDE coisas vão · Pages definem O QUE. Permitem reuso de chrome (sidebar, header, footer) sem duplicar.',
    icon: <LayoutTemplate size={20} />,
    color: 'var(--warning)',
    importPath: '@/components/templates',
    components: [
      { name: 'DocsLayout', description: 'Sidebar fixa + content area · usado pelo site da documentação', file: 'docs/Layout.tsx' },
      { name: 'AppShell (pattern)', description: 'Sidebar + topbar + main + footer · template de telas do produto', file: 'pages/patterns/AppShell.tsx' },
      { name: 'DashboardLayout (pattern)', description: 'Grid de KPIs + widgets · template para cockpits', file: 'pages/patterns/Dashboard.tsx' },
      { name: 'FormSectioned (pattern)', description: 'TOC sticky + form sectioned · template para formulários longos', file: 'pages/patterns/FormSectioned.tsx' },
    ],
  },
]

const principles = [
  {
    n: '1',
    title: 'Composição sobre duplicação',
    description: 'Reutilize atoms em molecules e molecules em organisms. Nunca duplique estilo — se precisar, extraia para o nível inferior.',
  },
  {
    n: '2',
    title: 'Dependências fluem para baixo',
    description: 'Templates dependem de organisms, organisms de molecules, molecules de atoms. Nunca o contrário. Atoms NUNCA importam molecules ou organisms.',
  },
  {
    n: '3',
    title: 'Tokens em todos os níveis',
    description: 'Cores, tipografia, espaçamento e radius vêm de CSS variables (globals.css). Todos os níveis consomem os mesmos tokens — eles são a base abaixo dos atoms.',
  },
  {
    n: '4',
    title: 'Stateless em molecules · stateful em organisms',
    description: 'Molecules são "burras": recebem props e renderizam. Organisms podem ter estado interno (open/close, hover, drag). Pages têm o estado global e de domínio.',
  },
  {
    n: '5',
    title: 'Templates não têm conteúdo final',
    description: 'Um Template recebe slots/children. Quando você passa conteúdo real, vira uma Page. Isso permite reusar a estrutura entre múltiplas páginas.',
  },
]

export function AtomicDesignPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        num="00"
        category="Documentação · Arquitetura"
        title="Atomic Design"
        italic="brad frost · adaptado ao TKWS OS"
        description="Como organizamos os 100+ componentes do design system em uma hierarquia consistente. Cada componente sabe onde mora — e o que pode importar."
        tag="taxonomia"
      />

      <SubHead num="A" title="A hierarquia · 4 níveis" italic="atoms → molecules → organisms → templates" />
      <Showcase>
        <div className="grid grid-cols-2 gap-4 max-[760px]:grid-cols-1">
          {levels.map((level) => (
            <div
              key={level.num}
              className="rounded-[14px] border p-5 transition-all"
              style={{
                background: 'var(--surface-1)',
                borderColor: 'var(--line-2)',
                borderLeftWidth: 3,
                borderLeftColor: level.color,
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-[10px]"
                  style={{ background: `${level.color}1f`, color: level.color }}
                >
                  {level.icon}
                </span>
                <div>
                  <div
                    className="mono text-[10.5px] font-semibold uppercase tracking-[1.2px]"
                    style={{ color: 'var(--text-mute)' }}
                  >
                    Nível {level.num}
                  </div>
                  <h3
                    className="serif text-[20px] font-normal"
                    style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
                  >
                    {level.label}{' '}
                    <em className="italic font-normal" style={{ color: level.color }}>
                      {level.italic}
                    </em>
                  </h3>
                </div>
              </div>
              <p className="mt-3 text-[13px] leading-[1.55]" style={{ color: 'var(--text-soft)' }}>
                {level.description}
              </p>
              <div
                className="mono mt-4 inline-flex items-center gap-2 rounded-[6px] border px-2.5 py-1.5 text-[11px]"
                style={{
                  background: 'var(--surface-2)',
                  borderColor: 'var(--line-1)',
                  color: 'var(--text-soft)',
                }}
              >
                import from <code style={{ color: level.color }}>{level.importPath}</code>
              </div>
              <div className="mt-3 text-[12px]" style={{ color: 'var(--text-mute)' }}>
                <span style={{ color: 'var(--text)', fontWeight: 600 }}>
                  {level.components.length}
                </span>{' '}
                componentes
              </div>
            </div>
          ))}
        </div>
      </Showcase>

      <SubHead num="B" title="Princípios" italic="o que fazer e não fazer" />
      <Showcase>
        <ol className="grid gap-3">
          {principles.map((p) => (
            <li
              key={p.n}
              className="grid grid-cols-[36px_1fr] items-start gap-4 rounded-[10px] border p-4"
              style={{ background: 'var(--surface-1)', borderColor: 'var(--line-1)' }}
            >
              <span
                className="serif inline-flex h-9 w-9 items-center justify-center rounded-full"
                style={{
                  background: 'var(--brand-soft)',
                  color: 'var(--brand)',
                  fontSize: 18,
                  fontWeight: 300,
                }}
              >
                {p.n}
              </span>
              <div>
                <div className="font-semibold text-[14px]" style={{ color: 'var(--text)' }}>
                  {p.title}
                </div>
                <p className="mt-1 text-[12.5px] leading-[1.55]" style={{ color: 'var(--text-soft)' }}>
                  {p.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Showcase>

      <SubHead num="C" title="Catálogo completo por nível" italic={`${levels.reduce((a, l) => a + l.components.length, 0)} componentes mapeados`} />
      {levels.map((level) => (
        <div key={level.num} className="mt-6">
          <div className="mb-3 flex items-center gap-3">
            <span
              className="inline-flex h-7 w-7 items-center justify-center rounded-[8px]"
              style={{ background: `${level.color}1f`, color: level.color }}
            >
              {level.icon}
            </span>
            <h4 className="serif text-[18px] font-normal" style={{ color: 'var(--text)' }}>
              {level.label} <em className="italic font-normal" style={{ color: level.color }}>· {level.components.length}</em>
            </h4>
          </div>
          <div
            className="overflow-hidden rounded-[12px] border"
            style={{ background: 'var(--surface-1)', borderColor: 'var(--line-2)' }}
          >
            {level.components.map((c, i) => (
              <div
                key={c.name}
                className="grid grid-cols-[1fr_2fr_auto] items-center gap-4 px-5 py-3"
                style={{
                  borderBottom: i < level.components.length - 1 ? '1px solid var(--line-1)' : 'none',
                }}
              >
                <div className="font-semibold text-[13px]" style={{ color: 'var(--text)' }}>
                  {c.name}
                </div>
                <div className="text-[12.5px]" style={{ color: 'var(--text-soft)' }}>
                  {c.description}
                </div>
                <code
                  className="mono text-[10.5px]"
                  style={{ color: 'var(--text-mute)' }}
                >
                  {c.file}
                </code>
              </div>
            ))}
          </div>
        </div>
      ))}

      <SubHead num="D" title="Como usar nos imports" italic="atomic paths" />
      <Showcase>
        <div className="space-y-3">
          <p className="text-[13px]" style={{ color: 'var(--text-soft)' }}>
            Você pode importar dos paths atômicos OU dos paths legados (<code className="mono">@/components/ui/*</code>{' '}
            e <code className="mono">@/components/tkws/*</code>). Os barrel re-exports garantem
            que as duas formas convivem — útil para migração gradual.
          </p>
          <div
            className="mono rounded-[10px] border p-4 text-[12px] leading-[1.6]"
            style={{
              background: 'var(--surface-2)',
              borderColor: 'var(--line-1)',
              color: 'var(--text-soft)',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-mute)' }}>// preferido · atomic</span>
            </div>
            <div>
              <span style={{ color: 'var(--success)' }}>import</span>{' '}
              {`{ Button, Badge }`}{' '}
              <span style={{ color: 'var(--success)' }}>from</span>{' '}
              <span style={{ color: 'var(--brand)' }}>'@/components/atoms'</span>
            </div>
            <div>
              <span style={{ color: 'var(--success)' }}>import</span>{' '}
              {`{ Card, CardHeader, Tabs }`}{' '}
              <span style={{ color: 'var(--success)' }}>from</span>{' '}
              <span style={{ color: 'var(--brand)' }}>'@/components/molecules'</span>
            </div>
            <div>
              <span style={{ color: 'var(--success)' }}>import</span>{' '}
              {`{ Dialog, Chat, Kanban }`}{' '}
              <span style={{ color: 'var(--success)' }}>from</span>{' '}
              <span style={{ color: 'var(--brand)' }}>'@/components/organisms'</span>
            </div>
            <div className="mt-3">
              <span style={{ color: 'var(--text-mute)' }}>// legado · ainda funciona (re-export)</span>
            </div>
            <div>
              <span style={{ color: 'var(--success)' }}>import</span>{' '}
              {`{ Button }`}{' '}
              <span style={{ color: 'var(--success)' }}>from</span>{' '}
              <span style={{ color: 'var(--brand)' }}>'@/components/ui/button'</span>
            </div>
          </div>
        </div>
      </Showcase>

      <SubHead num="E" title="Diagrama de dependência" italic="quem importa quem" />
      <Showcase>
        <div
          className="grid grid-cols-1 gap-2 rounded-[12px] border p-5"
          style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)' }}
        >
          {[
            { label: 'Pages', sub: 'Welcome · ProjectList · Dashboard · CRMPipeline · ...', tone: 'var(--pink)' },
            { label: 'Templates', sub: 'DocsLayout · AppShell · DashboardLayout', tone: 'var(--warning)' },
            { label: 'Organisms', sub: 'Dialog · Chat · Kanban · ProductCard · ...', tone: 'var(--success)' },
            { label: 'Molecules', sub: 'Card · Tabs · Field · KpiHero · ...', tone: 'var(--purple)' },
            { label: 'Atoms', sub: 'Button · Badge · Input · Spinner · ...', tone: 'var(--brand)' },
            { label: 'Tokens (CSS vars)', sub: '--brand · --surface-1 · Fraunces · 14px · ...', tone: 'var(--text-mute)' },
          ].map((row, i, arr) => (
            <React.Fragment key={row.label}>
              <div
                className="flex items-center justify-between rounded-[8px] border px-4 py-3"
                style={{
                  background: 'var(--surface-1)',
                  borderColor: row.tone,
                  borderLeftWidth: 3,
                }}
              >
                <div>
                  <div className="font-semibold text-[14px]" style={{ color: 'var(--text)' }}>
                    {row.label}
                  </div>
                  <div className="text-[11.5px] mono" style={{ color: 'var(--text-mute)' }}>
                    {row.sub}
                  </div>
                </div>
              </div>
              {i < arr.length - 1 && (
                <div className="flex justify-center" style={{ color: 'var(--text-mute)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 5v14" />
                    <path d="m19 12-7 7-7-7" />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
          <div className="mono mt-3 text-center text-[11px]" style={{ color: 'var(--text-mute)' }}>
            ↑ cada nível importa apenas os de baixo · NUNCA o contrário
          </div>
        </div>
      </Showcase>

      <SubHead num="F" title="Leitura recomendada" italic="material de base" />
      <Showcase>
        <a
          href="https://atomicdesign.bradfrost.com/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3 rounded-[10px] border p-4 transition-all hover:brightness-110"
          style={{
            background: 'var(--surface-2)',
            borderColor: 'var(--line-2)',
            textDecoration: 'none',
          }}
        >
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-[8px]"
            style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}
          >
            <BookOpen size={18} />
          </span>
          <div>
            <div className="font-semibold text-[14px]" style={{ color: 'var(--text)' }}>
              Atomic Design · Brad Frost
            </div>
            <div className="mono text-[11px]" style={{ color: 'var(--text-mute)' }}>
              atomicdesign.bradfrost.com
            </div>
          </div>
        </a>
      </Showcase>
    </div>
  )
}
