import * as React from 'react'
import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from '@tanstack/react-router'
import { Layout } from '@/components/docs/Layout'
import { Spinner } from '@/components/ui/spinner'

// =============================================================================
// EAGER · só o que carrega imediato (Welcome) — first paint < 100ms
// =============================================================================
import { WelcomePage } from '@/pages/Welcome'

// =============================================================================
// LAZY · 143 demais rotas · React.lazy + Suspense
// Reduz main bundle em ~70% · TanStack Router preload='intent' faz prefetch no hover
// =============================================================================

/** Wraps lazy import of a named export · React.lazy needs `default` */
function lazyPage<K extends string>(
  importer: () => Promise<Record<K, React.ComponentType<unknown>>>,
  key: K
): React.LazyExoticComponent<React.ComponentType<unknown>> {
  return React.lazy(() => importer().then((m) => ({ default: m[key] })))
}

// Foundations
const ManifestoPage = lazyPage(() => import('@/pages/Manifesto'), 'ManifestoPage')
const PrinciplesPage = lazyPage(() => import('@/pages/Principles'), 'PrinciplesPage')
const AtomicDesignPage = lazyPage(() => import('@/pages/AtomicDesign'), 'AtomicDesignPage')
const IconographyPage = lazyPage(() => import('@/pages/Iconography'), 'IconographyPage')
const ChartsGalleryPage = lazyPage(() => import('@/pages/ChartsGallery'), 'ChartsGalleryPage')
const MobileComponentsPage = lazyPage(() => import('@/pages/MobileComponents'), 'MobileComponentsPage')
const VersusPage = lazyPage(() => import('@/pages/Versus'), 'VersusPage')
const TypographyPage = lazyPage(() => import('@/pages/Typography'), 'TypographyPage')
const ColorPage = lazyPage(() => import('@/pages/Color'), 'ColorPage')
const SpacingPage = lazyPage(() => import('@/pages/Spacing'), 'SpacingPage')
const BestPracticesPage = lazyPage(() => import('@/pages/BestPractices'), 'BestPracticesPage')
const AiPromptsIndexPage = lazyPage(() => import('@/pages/AiPromptsIndex'), 'AiPromptsIndexPage')

// Concept pages
const PersonasPage = lazyPage(() => import('@/pages/Personas'), 'PersonasPage')
const GlossaryPage = lazyPage(() => import('@/pages/Glossary'), 'GlossaryPage')
const PermissionsPage = lazyPage(() => import('@/pages/Permissions'), 'PermissionsPage')
const StackPage = lazyPage(() => import('@/pages/Stack'), 'StackPage')
const InspirationsPage = lazyPage(() => import('@/pages/Inspirations'), 'InspirationsPage')
const LiteracyPage = lazyPage(() => import('@/pages/Literacy'), 'LiteracyPage')

// Foundation components
const ButtonPage = lazyPage(() => import('@/pages/components/Button'), 'ButtonPage')
const ButtonGroupPage = lazyPage(() => import('@/pages/components/ButtonGroup'), 'ButtonGroupPage')
const BadgePage = lazyPage(() => import('@/pages/components/Badge'), 'BadgePage')
const AvatarPage = lazyPage(() => import('@/pages/components/Avatar'), 'AvatarPage')
const LabelPage = lazyPage(() => import('@/pages/components/Label'), 'LabelPage')
const SeparatorPage = lazyPage(() => import('@/pages/components/Separator'), 'SeparatorPage')

// Inputs
const InputPage = lazyPage(() => import('@/pages/components/Input'), 'InputPage')
const TextareaPage = lazyPage(() => import('@/pages/components/Textarea'), 'TextareaPage')
const SelectPage = lazyPage(() => import('@/pages/components/Select'), 'SelectPage')
const ComboboxPage = lazyPage(() => import('@/pages/components/Combobox'), 'ComboboxPage')
const RadioGroupPage = lazyPage(() => import('@/pages/components/RadioGroup'), 'RadioGroupPage')
const CheckboxPage = lazyPage(() => import('@/pages/components/Checkbox'), 'CheckboxPage')
const SwitchPage = lazyPage(() => import('@/pages/components/Switch'), 'SwitchPage')
const SliderPage = lazyPage(() => import('@/pages/components/Slider'), 'SliderPage')
const InputOtpPage = lazyPage(() => import('@/pages/components/InputOtp'), 'InputOtpPage')
const DatepickerPage = lazyPage(() => import('@/pages/components/Datepicker'), 'DatepickerPage')
const CalendarPage = lazyPage(() => import('@/pages/components/Calendar'), 'CalendarPage')
const FormPage = lazyPage(() => import('@/pages/components/Form'), 'FormPage')
const RatingPage = lazyPage(() => import('@/pages/components/Rating'), 'RatingPage')
const FileInputPage = lazyPage(() => import('@/pages/components/FileInput'), 'FileInputPage')
const NumberInputPage = lazyPage(() => import('@/pages/components/NumberInput'), 'NumberInputPage')
const PhoneInputPage = lazyPage(() => import('@/pages/components/PhoneInput'), 'PhoneInputPage')

// Navigation
const TabsPage = lazyPage(() => import('@/pages/components/Tabs'), 'TabsPage')
const TogglePage = lazyPage(() => import('@/pages/components/Toggle'), 'TogglePage')
const BreadcrumbPage = lazyPage(() => import('@/pages/components/Breadcrumb'), 'BreadcrumbPage')
const PaginationPage = lazyPage(() => import('@/pages/components/Pagination'), 'PaginationPage')
const MenubarPage = lazyPage(() => import('@/pages/components/Menubar'), 'MenubarPage')
const MenubarRealPage = lazyPage(() => import('@/pages/components/MenubarReal'), 'MenubarRealPage')
const NavigationMenuPage = lazyPage(() => import('@/pages/components/NavigationMenu'), 'NavigationMenuPage')
const SidebarPage = lazyPage(() => import('@/pages/components/SidebarPage'), 'SidebarPage')

// Overlays
const DialogPage = lazyPage(() => import('@/pages/components/Dialog'), 'DialogPage')
const AlertDialogPage = lazyPage(() => import('@/pages/components/AlertDialog'), 'AlertDialogPage')
const SheetPage = lazyPage(() => import('@/pages/components/Sheet'), 'SheetPage')
const DropdownPage = lazyPage(() => import('@/pages/components/Dropdown'), 'DropdownPage')
const ContextMenuPage = lazyPage(() => import('@/pages/components/ContextMenu'), 'ContextMenuPage')
const PopoverPage = lazyPage(() => import('@/pages/components/Popover'), 'PopoverPage')
const TooltipPage = lazyPage(() => import('@/pages/components/Tooltip'), 'TooltipPage')
const HoverCardPage = lazyPage(() => import('@/pages/components/HoverCard'), 'HoverCardPage')
const CommandPage = lazyPage(() => import('@/pages/components/Command'), 'CommandPage')
const DrawerPage = lazyPage(() => import('@/pages/components/Drawer'), 'DrawerPage')

// Feedback
const AlertPage = lazyPage(() => import('@/pages/components/Alert'), 'AlertPage')
const ToastPage = lazyPage(() => import('@/pages/components/Toast'), 'ToastPage')
const SkeletonPage = lazyPage(() => import('@/pages/components/Skeleton'), 'SkeletonPage')
const ProgressPage = lazyPage(() => import('@/pages/components/Progress'), 'ProgressPage')
const EmptyStatePage = lazyPage(() => import('@/pages/components/EmptyState'), 'EmptyStatePage')
const GoalRingPage = lazyPage(() => import('@/pages/components/GoalRing'), 'GoalRingPage')
const SpinnerPage = lazyPage(() => import('@/pages/components/Spinner'), 'SpinnerPage')
const KbdPage = lazyPage(() => import('@/pages/components/KbdPage'), 'KbdPage')
const ClipboardPage = lazyPage(() => import('@/pages/components/Clipboard'), 'ClipboardPage')
const BannerPage = lazyPage(() => import('@/pages/components/Banner'), 'BannerPage')

// Data display
const CardPage = lazyPage(() => import('@/pages/components/Card'), 'CardPage')
const TablePage = lazyPage(() => import('@/pages/components/Table'), 'TablePage')
const DataTablePage = lazyPage(() => import('@/pages/components/DataTable'), 'DataTablePage')
const RichListPage = lazyPage(() => import('@/pages/components/RichList'), 'RichListPage')
const KanbanPage = lazyPage(() => import('@/pages/components/Kanban'), 'KanbanPage')
const AccordionPage = lazyPage(() => import('@/pages/components/Accordion'), 'AccordionPage')
const CollapsiblePage = lazyPage(() => import('@/pages/components/Collapsible'), 'CollapsiblePage')
const CarouselPage = lazyPage(() => import('@/pages/components/Carousel'), 'CarouselPage')
const AspectRatioPage = lazyPage(() => import('@/pages/components/AspectRatio'), 'AspectRatioPage')
const ResizablePage = lazyPage(() => import('@/pages/components/Resizable'), 'ResizablePage')
const ScrollAreaPage = lazyPage(() => import('@/pages/components/ScrollArea'), 'ScrollAreaPage')
const TimelinePage = lazyPage(() => import('@/pages/components/Timeline'), 'TimelinePage')
const ListGroupPage = lazyPage(() => import('@/pages/components/ListGroup'), 'ListGroupPage')

// Layout
const HeaderPage = lazyPage(() => import('@/pages/components/Header'), 'HeaderPage')
const DetailHeroPage = lazyPage(() => import('@/pages/components/DetailHero'), 'DetailHeroPage')
const WizardPage = lazyPage(() => import('@/pages/components/Wizard'), 'WizardPage')
const FilterSidebarPage = lazyPage(() => import('@/pages/components/FilterSidebar'), 'FilterSidebarPage')
const BulkActionBarPage = lazyPage(() => import('@/pages/components/BulkActionBar'), 'BulkActionBarPage')

// Charts
const KpiPage = lazyPage(() => import('@/pages/components/Kpi'), 'KpiPage')
const DonutPage = lazyPage(() => import('@/pages/components/Donut'), 'DonutPage')
const BarChartPage = lazyPage(() => import('@/pages/components/BarChart'), 'BarChartPage')
const LineChartPage = lazyPage(() => import('@/pages/components/LineChart'), 'LineChartPage')
const HeatmapPage = lazyPage(() => import('@/pages/components/Heatmap'), 'HeatmapPage')
const ChartPage = lazyPage(() => import('@/pages/components/Chart'), 'ChartPage')
const GanttPage = lazyPage(() => import('@/pages/components/Gantt'), 'GanttPage')

// New primitives
const ChatPage = lazyPage(() => import('@/pages/components/Chat'), 'ChatPage')
const TransferListPage = lazyPage(() => import('@/pages/components/TransferList'), 'TransferListPage')
const CheckCardsPage = lazyPage(() => import('@/pages/components/CheckCards'), 'CheckCardsPage')
const MaskedInputsPage = lazyPage(() => import('@/pages/components/MaskedInputs'), 'MaskedInputsPage')
const LightboxPage = lazyPage(() => import('@/pages/components/LightboxPage'), 'LightboxPage')
const AILumenPage = lazyPage(() => import('@/pages/components/AILumen'), 'AILumenPage')
const TagInputPage = lazyPage(() => import('@/pages/components/TagInputPage'), 'TagInputPage')
const InlineEditPage = lazyPage(() => import('@/pages/components/InlineEditPage'), 'InlineEditPage')
const NotificationBellPage = lazyPage(() => import('@/pages/components/NotificationBellPage'), 'NotificationBellPage')
const ChecklistWidgetPage = lazyPage(() => import('@/pages/components/ChecklistWidgetPage'), 'ChecklistWidgetPage')
const CoachmarkPage = lazyPage(() => import('@/pages/components/CoachmarkPage'), 'CoachmarkPage')

// Patterns
const FormSectionedPattern = lazyPage(() => import('@/pages/patterns/FormSectioned'), 'FormSectionedPattern')
const FormUploadPattern = lazyPage(() => import('@/pages/patterns/FormUpload'), 'FormUploadPattern')
const FormReviewPattern = lazyPage(() => import('@/pages/patterns/FormReview'), 'FormReviewPattern')
const FormConditionalPattern = lazyPage(() => import('@/pages/patterns/FormConditional'), 'FormConditionalPattern')
const ProjectListPattern = lazyPage(() => import('@/pages/patterns/ProjectList'), 'ProjectListPattern')
const ProjectDetailPattern = lazyPage(() => import('@/pages/patterns/ProjectDetail'), 'ProjectDetailPattern')
const NewProjectWizardPattern = lazyPage(() => import('@/pages/patterns/NewProjectWizard'), 'NewProjectWizardPattern')
const SettingsPattern = lazyPage(() => import('@/pages/patterns/Settings'), 'SettingsPattern')
const AuthPattern = lazyPage(() => import('@/pages/patterns/Auth'), 'AuthPattern')
const ClientPortalPattern = lazyPage(() => import('@/pages/patterns/ClientPortal'), 'ClientPortalPattern')
const PartnerPortalPattern = lazyPage(() => import('@/pages/patterns/PartnerPortal'), 'PartnerPortalPattern')
const DashboardPattern = lazyPage(() => import('@/pages/patterns/Dashboard'), 'DashboardPattern')
const FinancialPattern = lazyPage(() => import('@/pages/patterns/Financial'), 'FinancialPattern')
const PerformancePattern = lazyPage(() => import('@/pages/patterns/Performance'), 'PerformancePattern')
const ArchObraPattern = lazyPage(() => import('@/pages/patterns/ArchObra'), 'ArchObraPattern')
const CatalogPattern = lazyPage(() => import('@/pages/patterns/Catalog'), 'CatalogPattern')
const StatesPattern = lazyPage(() => import('@/pages/patterns/States'), 'StatesPattern')
const CollaborationPattern = lazyPage(() => import('@/pages/patterns/Collaboration'), 'CollaborationPattern')
const OverlaysPattern = lazyPage(() => import('@/pages/patterns/Overlays'), 'OverlaysPattern')
const KanbanSwimlanesPattern = lazyPage(() => import('@/pages/patterns/KanbanSwimlanes'), 'KanbanSwimlanesPattern')
const OnboardingPattern = lazyPage(() => import('@/pages/patterns/Onboarding'), 'OnboardingPattern')
const SystemPagesPattern = lazyPage(() => import('@/pages/patterns/SystemPages'), 'SystemPagesPattern')
const CalendarViewsPattern = lazyPage(() => import('@/pages/patterns/CalendarViews'), 'CalendarViewsPattern')
const FloorplanPattern = lazyPage(() => import('@/pages/patterns/Floorplan'), 'FloorplanPattern')
const FullCRMPattern = lazyPage(() => import('@/pages/patterns/FullCRM'), 'FullCRMPattern')
const MobilePattern = lazyPage(() => import('@/pages/patterns/Mobile'), 'MobilePattern')
const MotionPattern = lazyPage(() => import('@/pages/patterns/Motion'), 'MotionPattern')
const MediaGalleryPattern = lazyPage(() => import('@/pages/patterns/MediaGallery'), 'MediaGalleryPattern')
const RecipeScreensPattern = lazyPage(() => import('@/pages/patterns/RecipeScreens'), 'RecipeScreensPattern')
const ViewsByRolePattern = lazyPage(() => import('@/pages/patterns/ViewsByRole'), 'ViewsByRolePattern')
const AppShellPattern = lazyPage(() => import('@/pages/patterns/AppShell'), 'AppShellPattern')

// CRM components
const CrmLeadScorePage = lazyPage(() => import('@/pages/components/CrmLeadScore'), 'CrmLeadScorePage')
const CrmChannelBarPage = lazyPage(() => import('@/pages/components/CrmChannelBar'), 'CrmChannelBarPage')
const CrmStageStepperPage = lazyPage(() => import('@/pages/components/CrmStageStepper'), 'CrmStageStepperPage')
const CrmDealCardPage = lazyPage(() => import('@/pages/components/CrmDealCard'), 'CrmDealCardPage')
const CrmFunnelPage = lazyPage(() => import('@/pages/components/CrmFunnel'), 'CrmFunnelPage')

// CRM patterns
const CRMPipelinePattern = lazyPage(() => import('@/pages/patterns/CRMPipeline'), 'CRMPipelinePattern')
const CRMDashboardPattern = lazyPage(() => import('@/pages/patterns/CRMDashboard'), 'CRMDashboardPattern')
const CRMContactDetailPattern = lazyPage(() => import('@/pages/patterns/CRMContactDetail'), 'CRMContactDetailPattern')
const CRMOpportunitiesKanbanPattern = lazyPage(() => import('@/pages/patterns/CRMOpportunitiesKanban'), 'CRMOpportunitiesKanbanPattern')
const CRMOpportunitiesListPattern = lazyPage(() => import('@/pages/patterns/CRMOpportunitiesList'), 'CRMOpportunitiesListPattern')
const CRMOpportunityDetailPattern = lazyPage(() => import('@/pages/patterns/CRMOpportunityDetail'), 'CRMOpportunityDetailPattern')
const CRMOpportunitiesDashboardPattern = lazyPage(() => import('@/pages/patterns/CRMOpportunitiesDashboard'), 'CRMOpportunitiesDashboardPattern')

// =============================================================================
// Fallback Suspense · spinner editorial enquanto carrega chunk
// =============================================================================

function PageFallback() {
  return (
    <div className="flex h-[60vh] items-center justify-center" aria-live="polite">
      <Spinner size="lg" tone="brand" label="Carregando" />
    </div>
  )
}

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <React.Suspense fallback={<PageFallback />}>
        <Outlet />
      </React.Suspense>
    </Layout>
  ),
})

function route(path: string, Component: React.ComponentType<unknown>) {
  return createRoute({
    getParentRoute: () => rootRoute,
    path,
    component: Component as React.FC,
  })
}

const routes = [
  // Foundations
  route('/', WelcomePage),
  route('/manifesto', ManifestoPage),
  route('/principles', PrinciplesPage),
  route('/versus', VersusPage),
  route('/typography', TypographyPage),
  route('/color', ColorPage),
  route('/spacing', SpacingPage),
  route('/best-practices', BestPracticesPage),
  route('/ai-prompts', AiPromptsIndexPage),
  route('/atomic-design', AtomicDesignPage),
  route('/iconography', IconographyPage),
  route('/charts-gallery', ChartsGalleryPage),
  route('/mobile-components', MobileComponentsPage),

  // Concept pages
  route('/personas', PersonasPage),
  route('/glossary', GlossaryPage),
  route('/permissions', PermissionsPage),
  route('/stack', StackPage),
  route('/inspirations', InspirationsPage),
  route('/literacy', LiteracyPage),

  // Foundation components
  route('/components/button', ButtonPage),
  route('/components/button-group', ButtonGroupPage),
  route('/components/badge', BadgePage),
  route('/components/avatar', AvatarPage),
  route('/components/label', LabelPage),
  route('/components/separator', SeparatorPage),

  // Inputs
  route('/components/input', InputPage),
  route('/components/textarea', TextareaPage),
  route('/components/select', SelectPage),
  route('/components/combobox', ComboboxPage),
  route('/components/radio-group', RadioGroupPage),
  route('/components/checkbox', CheckboxPage),
  route('/components/switch', SwitchPage),
  route('/components/slider', SliderPage),
  route('/components/input-otp', InputOtpPage),
  route('/components/datepicker', DatepickerPage),
  route('/components/calendar', CalendarPage),
  route('/components/form', FormPage),
  route('/components/rating', RatingPage),
  route('/components/file-input', FileInputPage),
  route('/components/number-input', NumberInputPage),
  route('/components/phone-input', PhoneInputPage),

  // Navigation
  route('/components/tabs', TabsPage),
  route('/components/toggle', TogglePage),
  route('/components/breadcrumb', BreadcrumbPage),
  route('/components/pagination', PaginationPage),
  route('/components/menubar', MenubarPage),
  route('/components/menubar-real', MenubarRealPage),
  route('/components/navigation-menu', NavigationMenuPage),
  route('/components/sidebar', SidebarPage),

  // Overlays
  route('/components/dialog', DialogPage),
  route('/components/alert-dialog', AlertDialogPage),
  route('/components/sheet', SheetPage),
  route('/components/dropdown', DropdownPage),
  route('/components/context-menu', ContextMenuPage),
  route('/components/popover', PopoverPage),
  route('/components/tooltip', TooltipPage),
  route('/components/hover-card', HoverCardPage),
  route('/components/command', CommandPage),
  route('/components/drawer', DrawerPage),

  // Feedback
  route('/components/alert', AlertPage),
  route('/components/toast', ToastPage),
  route('/components/skeleton', SkeletonPage),
  route('/components/progress', ProgressPage),
  route('/components/empty-state', EmptyStatePage),
  route('/components/goal-ring', GoalRingPage),
  route('/components/spinner', SpinnerPage),
  route('/components/kbd', KbdPage),
  route('/components/clipboard', ClipboardPage),
  route('/components/banner', BannerPage),

  // Data display
  route('/components/card', CardPage),
  route('/components/table', TablePage),
  route('/components/data-table', DataTablePage),
  route('/components/rich-list', RichListPage),
  route('/components/kanban', KanbanPage),
  route('/components/accordion', AccordionPage),
  route('/components/collapsible', CollapsiblePage),
  route('/components/carousel', CarouselPage),
  route('/components/aspect-ratio', AspectRatioPage),
  route('/components/resizable', ResizablePage),
  route('/components/scroll-area', ScrollAreaPage),
  route('/components/timeline', TimelinePage),
  route('/components/list-group', ListGroupPage),

  // Layout
  route('/components/header', HeaderPage),
  route('/components/detail-hero', DetailHeroPage),
  route('/components/wizard', WizardPage),
  route('/components/filter-sidebar', FilterSidebarPage),
  route('/components/bulk-action-bar', BulkActionBarPage),

  // Charts
  route('/components/kpi', KpiPage),
  route('/components/donut', DonutPage),
  route('/components/bar-chart', BarChartPage),
  route('/components/line-chart', LineChartPage),
  route('/components/heatmap', HeatmapPage),
  route('/components/chart', ChartPage),
  route('/components/gantt', GanttPage),

  // New primitives
  route('/components/chat', ChatPage),
  route('/components/transfer-list', TransferListPage),
  route('/components/check-cards', CheckCardsPage),
  route('/components/masked-inputs', MaskedInputsPage),
  route('/components/lightbox', LightboxPage),
  route('/components/ai-lumen', AILumenPage),
  route('/components/tag-input', TagInputPage),
  route('/components/inline-edit', InlineEditPage),
  route('/components/notification-bell', NotificationBellPage),
  route('/components/checklist-widget', ChecklistWidgetPage),
  route('/components/coachmark', CoachmarkPage),

  // Patterns · Forms
  route('/patterns/form-sectioned', FormSectionedPattern),
  route('/patterns/form-upload', FormUploadPattern),
  route('/patterns/form-review', FormReviewPattern),
  route('/patterns/form-conditional', FormConditionalPattern),

  // Patterns · Screens
  route('/patterns/project-list', ProjectListPattern),
  route('/patterns/project-detail', ProjectDetailPattern),
  route('/patterns/new-project-wizard', NewProjectWizardPattern),
  route('/patterns/settings', SettingsPattern),
  route('/patterns/dashboard', DashboardPattern),

  // Patterns · Auth + Portais
  route('/patterns/auth', AuthPattern),
  route('/patterns/client-portal', ClientPortalPattern),
  route('/patterns/partner-portal', PartnerPortalPattern),

  // Patterns · Módulos
  route('/patterns/financial', FinancialPattern),
  route('/patterns/performance', PerformancePattern),
  route('/patterns/arch-obra', ArchObraPattern),
  route('/patterns/catalog', CatalogPattern),

  // Patterns · misc
  route('/patterns/states', StatesPattern),
  route('/patterns/collaboration', CollaborationPattern),
  route('/patterns/overlays', OverlaysPattern),
  route('/patterns/kanban-swimlanes', KanbanSwimlanesPattern),
  route('/patterns/motion', MotionPattern),
  route('/patterns/recipe-screens', RecipeScreensPattern),

  // Patterns · adicionais
  route('/patterns/onboarding', OnboardingPattern),
  route('/patterns/system-pages', SystemPagesPattern),
  route('/patterns/calendar-views', CalendarViewsPattern),
  route('/patterns/floorplan', FloorplanPattern),
  route('/patterns/full-crm', FullCRMPattern),
  route('/patterns/mobile', MobilePattern),
  route('/patterns/media-gallery', MediaGalleryPattern),
  route('/patterns/views-by-role', ViewsByRolePattern),
  route('/patterns/app-shell', AppShellPattern),

  // CRM components
  route('/components/crm-lead-score', CrmLeadScorePage),
  route('/components/crm-channel-bar', CrmChannelBarPage),
  route('/components/crm-stage-stepper', CrmStageStepperPage),
  route('/components/crm-deal-card', CrmDealCardPage),
  route('/components/crm-funnel', CrmFunnelPage),

  // CRM patterns
  route('/patterns/crm-pipeline', CRMPipelinePattern),
  route('/patterns/crm-dashboard', CRMDashboardPattern),
  route('/patterns/crm-contact-detail', CRMContactDetailPattern),
  route('/patterns/crm-opportunities-kanban', CRMOpportunitiesKanbanPattern),
  route('/patterns/crm-opportunities-list', CRMOpportunitiesListPattern),
  route('/patterns/crm-opportunity-detail', CRMOpportunityDetailPattern),
  route('/patterns/crm-opportunities-dashboard', CRMOpportunitiesDashboardPattern),
]

const routeTree = rootRoute.addChildren(routes)

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent', // pré-carrega o chunk no hover/focus do link
})
