/**
 * ORGANISMS · Atomic Design level 3
 *
 * Composições complexas de molecules + atoms. Representam seções
 * autocontidas com lógica visual e funcional rica. Frequentemente
 * stateful (open/closed, hover, drag).
 *
 * Ex: Dialog (overlay + content + close trigger + header + body + footer),
 *     Kanban (multi-column board com cards), Table (header + body + rows),
 *     NotificationBell (bell + popover + tabs + grouped rows).
 *
 * Uso: import { Dialog, Kanban, Chat } from '@/components/organisms'
 */

// Overlay organisms · todos com state aberto/fechado
export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogPortal,
  DialogOverlay,
} from '../ui/dialog'

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '../ui/alert-dialog'

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetPortal,
} from '../ui/sheet'

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerPortal,
  DrawerOverlay,
} from '../ui/drawer'

// Menu organisms · multi-item interativos
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from '../ui/dropdown-menu'

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
} from '../ui/context-menu'

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
} from '../ui/menubar'

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from '../ui/navigation-menu'

// Compound input organisms
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from '../ui/select'

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from '../ui/command'

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../ui/accordion'

export { Calendar } from '../ui/calendar'

// Data display organisms (complex multi-row)
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '../ui/table'

export {
  ChartContainer,
  ChartLegend,
  ChartTooltipContent,
  useChartConfig,
} from '../ui/chart'

export { Lightbox } from '../ui/lightbox'

export {
  Sidebar as AppSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter as AppSidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
} from '../ui/sidebar'

// TKWS organisms
export { AILumen } from '../tkws/ai-lumen'
export { BulkActionBar } from '../tkws/bulk-action-bar'
export { CategoryTree } from '../tkws/category-tree'
export { Chat } from '../tkws/chat'
export type { ChatMessage } from '../tkws/chat'
export { ChecklistWidget } from '../tkws/checklist-widget'
export type { ChecklistItem } from '../tkws/checklist-widget'
export { Coachmark } from '../tkws/coachmark'
export { SalesFunnel } from '../tkws/crm-pipeline'
export { DetailHero } from '../tkws/detail-hero'
export { FilterSidebar, FilterSection } from '../tkws/filter-sidebar'
export { Gantt } from '../tkws/gantt'
export { Kanban } from '../tkws/kanban'
export { NotificationBell } from '../tkws/notification-bell'
export type { NotificationItem } from '../tkws/notification-bell'
export { ProductCard } from '../tkws/product-card'
export { RichList } from '../tkws/rich-list'
export { TransferList } from '../tkws/transfer-list'

// Charts (TKWS)
export { VerticalBar, Donut, LineSeriesChart, Heatmap } from '../tkws/charts'
