/**
 * MOLECULES · Atomic Design level 2
 *
 * Composição de 2+ átomos em uma unidade funcional simples.
 * Ex: Card = ContainerBox + CardTitle + CardDescription;
 *     Tabs = TabsList(atom) + TabsTrigger(atom) + TabsContent(atom);
 *     Field = Label + Input + FieldHint.
 *
 * Uso: import { Card, Tabs, Tooltip } from '@/components/molecules'
 */

// Layout/container molecules
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../ui/card'
export type { CardProps } from '../ui/card'

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from '../ui/avatar'
export type { AvatarProps } from '../ui/avatar'

// Navigation molecules
export { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'

export { ToggleGroup, ToggleGroupItem } from '../ui/toggle'

export { ButtonGroup } from '../ui/button-group'

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb'

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '../ui/pagination'

// Overlay-trigger molecules (não as overlays inteiras, que são organisms)
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '../ui/popover'

export {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../ui/hover-card'

// Feedback molecules
export { Alert, AlertTitle, AlertDescription } from '../ui/alert'
export type { AlertProps } from '../ui/alert'

export { Banner } from '../ui/banner'
export type { BannerProps } from '../ui/banner'

export { EmptyState } from '../ui/empty-state'

export { GoalRing } from '../ui/goal-ring'

export { Clipboard } from '../ui/clipboard'

export { Rating } from '../ui/rating'

// Input molecules (compostos de input atom + extras)
export { FileInput } from '../ui/file-input'
export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '../ui/input-otp'
export { NumberInput } from '../ui/number-input'
export { PhoneInput } from '../ui/phone-input'
export {
  CPFInput,
  CNPJInput,
  CEPInput,
  RGInput,
  PlateInput,
  MoneyInput,
  InputAffix,
  MoneyDisplay,
} from '../ui/masked-input'

// Field helpers (label + input + hint)
export { Field, FieldHint } from '../ui/input'

// Selection molecules
export { RadioGroup, RadioGroupItem, RadioCard } from '../ui/radio-group'
export { CheckCards } from '../ui/check-cards'

// Specialized molecules
export { TagInput } from '../ui/tag-input'
export { InlineEdit } from '../ui/inline-edit'

// Disclosure molecules
export { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'

// Form molecule (RHF integration)
export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  useFormField,
} from '../ui/form'

// Group molecules
export { ListGroup, ListGroupItem } from '../ui/list-group'

export {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '../ui/resizable'

// TKWS-specific molecules (composições de atoms + outros molecules)
export { TkwsHeader, Subheader } from '../tkws/header'
export { KpiHero, KpiMini } from '../tkws/kpi'
export { WizardSteps } from '../tkws/wizard-steps'
export { Timeline } from '../tkws/timeline'
export type { TimelineItem } from '../tkws/timeline'

// CRM molecules
export { LeadScore } from '../tkws/crm-lead-score'
export { ChannelBar } from '../tkws/crm-channel-bar'
export { StageStepper } from '../tkws/crm-stage-stepper'
export { DealCard } from '../tkws/crm-deal-card'
