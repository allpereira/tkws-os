/**
 * Árvore de navegação do design system.
 * Cada nó tem: id (rota), label, count opcional, grupo.
 * Refletindo a estrutura do HTML original.
 */

export type NavItem = {
  to: string
  num: string
  name: string
  count?: string
}

export type NavGroup = {
  id: string
  label: string
  tag: 'doc' | 'fnd' | 'cmp' | 'pat' | 'data' | 'mod' | 'bp' | 'sh'
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    id: 'start',
    label: 'Começar aqui',
    tag: 'sh',
    items: [
      { to: '/', num: '00', name: 'Welcome' },
      { to: '/manifesto', num: '01', name: 'Manifesto' },
    ],
  },
  {
    id: 'doc',
    label: 'Documentação',
    tag: 'doc',
    items: [
      { to: '/principles', num: '02', name: 'Princípios', count: '6' },
      { to: '/atomic-design', num: '02.1', name: 'Atomic Design · arquitetura' },
      { to: '/versus', num: '03', name: 'Versus · ERP vs OS' },
      { to: '/personas', num: '03.1', name: 'Personas', count: '14' },
      { to: '/glossary', num: '03.2', name: 'Glossário' },
      { to: '/permissions', num: '03.3', name: 'Permissões · RBAC' },
      { to: '/literacy', num: '03.4', name: 'Densidades (3)' },
      { to: '/stack', num: '03.5', name: 'Stack' },
      { to: '/inspirations', num: '03.6', name: 'Inspirações' },
    ],
  },
  {
    id: 'foundations',
    label: 'Fundamentos',
    tag: 'fnd',
    items: [
      { to: '/typography', num: '04', name: 'Tipografia' },
      { to: '/iconography', num: '04.1', name: 'Iconografia · lucide' },
      { to: '/color', num: '05', name: 'Cor' },
      { to: '/spacing', num: '06', name: 'Espaçamento & Radius' },
    ],
  },
  {
    id: 'foundation-components',
    label: 'Foundation',
    tag: 'cmp',
    items: [
      { to: '/components/button', num: '06.1', name: 'Button', count: '5' },
      { to: '/components/button-group', num: '06.18', name: 'Button Group' },
      { to: '/components/badge', num: '06.2', name: 'Badge', count: '7' },
      { to: '/components/avatar', num: '06.6', name: 'Avatar', count: '4' },
      { to: '/components/label', num: '06.16', name: 'Label' },
      { to: '/components/separator', num: '06.17', name: 'Separator' },
    ],
  },
  {
    id: 'inputs',
    label: 'Inputs',
    tag: 'cmp',
    items: [
      { to: '/components/input', num: '07.1', name: 'Input' },
      { to: '/components/textarea', num: '07.2', name: 'Textarea' },
      { to: '/components/select', num: '07.3', name: 'Select' },
      { to: '/components/combobox', num: '07.4', name: 'Combobox' },
      { to: '/components/radio-group', num: '07.5', name: 'Radio Group' },
      { to: '/components/check-cards', num: '07.5b', name: 'Check Cards' },
      { to: '/components/checkbox', num: '07.6', name: 'Checkbox' },
      { to: '/components/switch', num: '07.7', name: 'Switch' },
      { to: '/components/slider', num: '07.8', name: 'Slider' },
      { to: '/components/input-otp', num: '07.9', name: 'Input OTP' },
      { to: '/components/datepicker', num: '07.10', name: 'Datepicker' },
      { to: '/components/calendar', num: '07.10b', name: 'Calendar' },
      { to: '/components/form', num: '07.11', name: 'Form (RHF + Zod)' },
      { to: '/components/rating', num: '07.12', name: 'Rating' },
      { to: '/components/file-input', num: '07.13', name: 'File Input' },
      { to: '/components/number-input', num: '07.14', name: 'Number Input' },
      { to: '/components/phone-input', num: '07.15', name: 'Phone Input' },
      { to: '/components/transfer-list', num: '07.16', name: 'Transfer List' },
      { to: '/components/masked-inputs', num: '07.17', name: 'Masked Inputs (BR)' },
      { to: '/components/tag-input', num: '07.18', name: 'Tag Input · chips' },
      { to: '/components/inline-edit', num: '07.19', name: 'Inline Edit · célula' },
    ],
  },
  {
    id: 'navigation',
    label: 'Navigation',
    tag: 'cmp',
    items: [
      { to: '/components/tabs', num: '08.1', name: 'Tabs' },
      { to: '/components/toggle', num: '08.2', name: 'Toggle' },
      { to: '/components/breadcrumb', num: '08.3', name: 'Breadcrumb' },
      { to: '/components/pagination', num: '08.4', name: 'Pagination' },
      { to: '/components/menubar', num: '08.5', name: 'Menubar (demo)' },
      { to: '/components/menubar-real', num: '08.5b', name: 'Menubar (Radix)' },
      { to: '/components/navigation-menu', num: '08.6', name: 'Navigation Menu' },
      { to: '/components/sidebar', num: '08.7', name: 'Sidebar (app)' },
    ],
  },
  {
    id: 'overlays',
    label: 'Overlays',
    tag: 'cmp',
    items: [
      { to: '/components/dialog', num: '09.1', name: 'Dialog' },
      { to: '/components/alert-dialog', num: '09.2', name: 'Alert Dialog' },
      { to: '/components/sheet', num: '09.3', name: 'Sheet · Drawer lateral' },
      { to: '/components/dropdown', num: '09.4', name: 'Dropdown Menu' },
      { to: '/components/context-menu', num: '09.5', name: 'Context Menu' },
      { to: '/components/popover', num: '09.6', name: 'Popover' },
      { to: '/components/tooltip', num: '09.7', name: 'Tooltip' },
      { to: '/components/hover-card', num: '09.8', name: 'HoverCard' },
      { to: '/components/command', num: '09.9', name: 'Command Palette' },
      { to: '/components/drawer', num: '09.10', name: 'Drawer (vaul)' },
    ],
  },
  {
    id: 'feedback',
    label: 'Feedback',
    tag: 'cmp',
    items: [
      { to: '/components/alert', num: '10.1', name: 'Alert' },
      { to: '/components/toast', num: '10.2', name: 'Toast' },
      { to: '/components/skeleton', num: '10.3', name: 'Skeleton' },
      { to: '/components/progress', num: '10.4', name: 'Progress' },
      { to: '/components/empty-state', num: '10.5', name: 'Empty State' },
      { to: '/components/goal-ring', num: '10.6', name: 'Goal Ring' },
      { to: '/components/spinner', num: '10.7', name: 'Spinner' },
      { to: '/components/kbd', num: '10.8', name: 'Kbd' },
      { to: '/components/clipboard', num: '10.9', name: 'Clipboard' },
      { to: '/components/banner', num: '10.10', name: 'Banner' },
    ],
  },
  {
    id: 'data',
    label: 'Data Display',
    tag: 'data',
    items: [
      { to: '/components/card', num: '11.1', name: 'Card' },
      { to: '/components/table', num: '11.2', name: 'Table' },
      { to: '/components/data-table', num: '11.3', name: 'DataTable' },
      { to: '/components/rich-list', num: '11.4', name: 'Rich List' },
      { to: '/components/kanban', num: '11.5', name: 'Kanban' },
      { to: '/components/accordion', num: '11.6', name: 'Accordion' },
      { to: '/components/collapsible', num: '11.7', name: 'Collapsible' },
      { to: '/components/carousel', num: '11.8', name: 'Carousel' },
      { to: '/components/aspect-ratio', num: '11.9', name: 'Aspect Ratio' },
      { to: '/components/resizable', num: '11.10', name: 'Resizable' },
      { to: '/components/scroll-area', num: '11.11', name: 'Scroll Area' },
      { to: '/components/timeline', num: '11.12', name: 'Timeline' },
      { to: '/components/list-group', num: '11.13', name: 'List Group' },
      { to: '/components/lightbox', num: '11.14', name: 'Lightbox' },
    ],
  },
  {
    id: 'layout',
    label: 'Layout',
    tag: 'pat',
    items: [
      { to: '/components/header', num: '12.1', name: 'Header · Subheader' },
      { to: '/components/detail-hero', num: '12.2', name: 'Detail Hero' },
      { to: '/components/wizard', num: '12.3', name: 'Wizard Steps' },
      { to: '/components/filter-sidebar', num: '12.4', name: 'Filter Sidebar' },
      { to: '/components/bulk-action-bar', num: '12.5', name: 'Bulk Action Bar' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    tag: 'data',
    items: [
      { to: '/components/kpi', num: '13.1', name: 'KPI Hero · Mini' },
      { to: '/components/donut', num: '13.2', name: 'Donut' },
      { to: '/components/bar-chart', num: '13.3', name: 'Bar Chart' },
      { to: '/components/line-chart', num: '13.4', name: 'Line Chart' },
      { to: '/components/heatmap', num: '13.5', name: 'Heatmap' },
      { to: '/components/chart', num: '13.6', name: 'Chart (wrapper)' },
      { to: '/components/gantt', num: '13.7', name: 'Gantt' },
      { to: '/charts-gallery', num: '13.0', name: 'Charts Gallery · 14 modelos' },
    ],
  },
  {
    id: 'collab',
    label: 'Collab',
    tag: 'mod',
    items: [
      { to: '/components/chat', num: '14.1', name: 'Chat' },
      { to: '/components/ai-lumen', num: '14.2', name: 'AI · Lúmen' },
      { to: '/components/notification-bell', num: '14.3', name: 'Notification Bell' },
      { to: '/components/checklist-widget', num: '14.4', name: 'Checklist Widget' },
      { to: '/components/coachmark', num: '14.5', name: 'Coachmark · spotlight' },
    ],
  },
  {
    id: 'crm-components',
    label: 'CRM · Componentes',
    tag: 'mod',
    items: [
      { to: '/components/crm-lead-score', num: 'CRM.1', name: 'Lead Score' },
      { to: '/components/crm-channel-bar', num: 'CRM.2', name: 'Channel Bar' },
      { to: '/components/crm-stage-stepper', num: 'CRM.3', name: 'Stage Stepper' },
      { to: '/components/crm-deal-card', num: 'CRM.4', name: 'Deal Card' },
      { to: '/components/crm-funnel', num: 'CRM.5', name: 'Sales Funnel' },
    ],
  },
  {
    id: 'crm-patterns',
    label: 'CRM · Telas',
    tag: 'pat',
    items: [
      { to: '/patterns/crm-pipeline', num: 'CRM.P1', name: 'Pipeline · Kanban + Funil' },
      { to: '/patterns/crm-dashboard', num: 'CRM.P2', name: 'CRM Dashboard' },
      { to: '/patterns/crm-contact-detail', num: 'CRM.P3', name: 'Contact Detail' },
    ],
  },
  {
    id: 'patterns-forms',
    label: 'Patterns · Forms',
    tag: 'pat',
    items: [
      { to: '/patterns/form-sectioned', num: 'P10.1', name: 'Sectioned + TOC' },
      { to: '/patterns/form-upload', num: 'P10.2', name: 'Form com upload' },
      { to: '/patterns/form-review', num: 'P10.3', name: 'Review final' },
      { to: '/patterns/form-conditional', num: 'P10.4', name: 'Conditional fields' },
    ],
  },
  {
    id: 'patterns-screens',
    label: 'Patterns · Telas',
    tag: 'pat',
    items: [
      { to: '/patterns/app-shell', num: 'P00', name: 'App Shell completo' },
      { to: '/patterns/project-list', num: 'P09.1', name: 'Project List' },
      { to: '/patterns/project-detail', num: 'P09.2', name: 'Project Detail' },
      { to: '/patterns/new-project-wizard', num: 'P09.3', name: 'New Project Wizard' },
      { to: '/patterns/settings', num: 'P09.4', name: 'Settings' },
      { to: '/patterns/dashboard', num: 'P28', name: 'Dashboard Cockpit' },
      { to: '/patterns/views-by-role', num: 'P36', name: 'Views by Role' },
      { to: '/patterns/onboarding', num: 'P22', name: 'Onboarding flow' },
      { to: '/patterns/system-pages', num: 'P21', name: 'System Pages (404/500)' },
      { to: '/patterns/calendar-views', num: 'P15', name: 'Calendar views' },
      { to: '/patterns/media-gallery', num: 'P19', name: 'Media Gallery' },
      { to: '/patterns/full-crm', num: 'P41', name: 'Full CRM' },
      { to: '/patterns/mobile', num: 'P25', name: 'Mobile · Capacitor' },
      { to: '/mobile-components', num: 'P25.1', name: 'Mobile · Componentes' },
    ],
  },
  {
    id: 'patterns-auth',
    label: 'Patterns · Auth + Portais',
    tag: 'pat',
    items: [
      { to: '/patterns/auth', num: 'P-AUTH', name: 'Auth flows' },
      { to: '/patterns/client-portal', num: 'P-CLI', name: 'Portal Cliente' },
      { to: '/patterns/partner-portal', num: 'P-PRT', name: 'Portal Parceiros' },
    ],
  },
  {
    id: 'patterns-modules',
    label: 'Patterns · Módulos',
    tag: 'pat',
    items: [
      { to: '/patterns/financial', num: 'P29', name: 'Financeiro' },
      { to: '/patterns/performance', num: 'P30', name: 'Performance' },
      { to: '/patterns/arch-obra', num: 'P31', name: 'Arquitetura & Obra' },
      { to: '/patterns/floorplan', num: 'P32', name: 'Planta & Spec' },
      { to: '/patterns/catalog', num: 'P33', name: 'Catálogo' },
    ],
  },
  {
    id: 'patterns-misc',
    label: 'Patterns · Estados + Outros',
    tag: 'pat',
    items: [
      { to: '/patterns/states', num: 'P26', name: 'Estados (loading/empty/error)' },
      { to: '/patterns/collaboration', num: 'P14', name: 'Colaboração' },
      { to: '/patterns/overlays', num: 'P12', name: 'Overlays avançados' },
      { to: '/patterns/kanban-swimlanes', num: 'P07.1', name: 'Kanban Swimlanes' },
      { to: '/patterns/motion', num: 'P30b', name: 'Motion · linguagem' },
      { to: '/patterns/recipe-screens', num: 'P34', name: 'Recipe Screens (cookbook)' },
    ],
  },
  {
    id: 'bp',
    label: 'Boas práticas',
    tag: 'bp',
    items: [
      { to: '/best-practices', num: '14', name: 'Construindo telas' },
      { to: '/ai-prompts', num: '15', name: 'Prompts para IA · índice' },
    ],
  },
]

export const allRoutes = navGroups.flatMap((g) => g.items.map((i) => i.to))
