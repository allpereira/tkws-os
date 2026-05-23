import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  // === Ações ===
  Plus, PlusCircle, PlusSquare, Minus, MinusCircle, Pencil, Edit3, SquarePen,
  Trash2, Copy, ClipboardCopy, Clipboard, Save, Search, SearchCheck, SearchX,
  Filter, FilterX, SlidersHorizontal, Share, Share2, Send, SendHorizontal,
  Download, Upload, RotateCw, RotateCcw, RefreshCw, X, Check, CheckCheck,
  MoreHorizontal, MoreVertical, Eye, EyeOff, Pin, PinOff, Bookmark, BookmarkPlus,
  Lock, Unlock, ZoomIn, ZoomOut,
  // === Navegação ===
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ChevronsUpDown,
  ChevronsLeft, ChevronsRight, ChevronsUp, ChevronsDown,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  ArrowUpRight, ArrowDownRight, ArrowUpLeft, ArrowDownLeft,
  Home, CornerDownLeft, CornerDownRight, CornerUpLeft, CornerUpRight,
  Undo, Redo, Undo2, Redo2, ExternalLink, MousePointer2,
  // === Estrutura ===
  LayoutDashboard, LayoutGrid, LayoutList, LayoutTemplate, LayoutPanelLeft,
  LayoutPanelTop, Sidebar, PanelLeft, PanelRight, PanelTop, PanelBottom,
  List, Rows3, Rows4, Columns3, Columns4, Grid2x2, Grid3x3,
  Boxes, Box, Folder, FolderOpen, FolderPlus, FolderClosed, FolderTree,
  Network, Component, Layers, Layers2, GalleryThumbnails, GalleryHorizontal,
  // === Pessoas ===
  User, UserPlus, UserMinus, UserCheck, UserX, UserCog, UserRound, UserRoundPlus,
  Users, UsersRound, Crown, Briefcase, AtSign, Contact, Contact2, Handshake,
  Baby, GraduationCap, PersonStanding,
  // === Status & Feedback ===
  CheckCircle2, AlertTriangle, AlertCircle, AlertOctagon, XCircle, Info,
  ShieldCheck, ShieldAlert, ShieldX, Shield, ShieldQuestion,
  Loader, Loader2, CircleDashed, CircleCheck, CircleX, CircleAlert,
  Hourglass, BellRing, BellOff,
  // === Tempo ===
  Calendar, CalendarDays, CalendarRange, CalendarClock, CalendarCheck,
  CalendarPlus, CalendarX, CalendarHeart, CalendarMinus,
  Clock, Clock3, Clock9, Timer, TimerReset, History, AlarmClock, AlarmClockCheck,
  // === Arquivos & Mídia ===
  File, FileText, FilePlus, FileMinus, FileX, FileCheck,
  FileSpreadsheet, FileCode2, FileImage, FileVideo, FileAudio, FileArchive,
  FileType, FileType2, FolderArchive, Image as ImageIcon, Images, Paperclip,
  Film, Music, Disc, FolderSearch,
  // === Comunicação ===
  Bell, MessageSquare, MessageCircle, MessageCircleMore, MessageSquareReply,
  Mail, MailOpen, MailPlus, MailCheck, Phone, PhoneCall, PhoneIncoming,
  PhoneOutgoing, PhoneOff, Reply, Forward, ThumbsUp, ThumbsDown,
  Heart, HeartPulse, Quote, Megaphone, Speech, Star, Bookmark as BookmarkIcon,
  Tag, Tags,
  // === Dados & KPIs ===
  TrendingUp, TrendingDown, BarChart3, BarChartHorizontal, BarChartBig,
  LineChart, PieChart, Activity, ActivitySquare, Target, Sigma, Percent,
  BadgePercent, Calculator, Hash, BarChart4, AreaChart, ScatterChart,
  // === Domínio · Arquitetura ===
  Building, Building2, HardHat, Hammer, Wrench, Construction, Paintbrush,
  PaintBucket, Ruler, Compass, Pickaxe, Shovel, ToyBrick,
  Lamp, LampCeiling, LampDesk, LampFloor, LampWallUp, LampWallDown,
  Sofa, Bed, BedDouble, BedSingle, Bath, Armchair,
  Microwave, Refrigerator, CookingPot, Utensils, ChefHat,
  DoorOpen, DoorClosed, ParkingMeter, Trees, TreePine,
  // === Comércio & Logística ===
  ShoppingCart, ShoppingBag, ShoppingBasket, Store, Warehouse,
  Gift, Receipt, ReceiptText, Package, PackageOpen, PackageCheck, PackageX,
  Truck, Ship, Plane, Car, Bike, Bus, Train, Anchor,
  Container, Forklift, Boxes as BoxesIcon,
  // === Sistema ===
  Settings, Settings2, Cog, Key, KeyRound, KeySquare,
  Globe, Globe2, Database, DatabaseBackup, Server, ServerOff, ServerCog,
  Cpu, MemoryStick, HardDrive, Cloud, CloudOff, CloudUpload, CloudDownload,
  Wifi, WifiOff, Bluetooth, Power, PowerOff, Plug,
  Sparkles, Bot, Brain, Atom, TestTube, Flame, Zap,
  // === Mobile & Devices ===
  Smartphone, Tablet, Monitor, Laptop, MonitorSmartphone,
  Watch, Tv, Tv2, Headphones, Mic, MicOff, Camera, CameraOff,
  Mouse, Keyboard, BatteryFull, BatteryMedium, BatteryLow, BatteryWarning,
  BatteryCharging, Signal, SignalHigh, SignalLow, SignalZero,
  // === Localização ===
  MapPin, MapPinned, Map, Navigation, Navigation2, Compass as CompassIcon,
  Flag, FlagTriangleRight, LandPlot, Mountain, Route,
  Crosshair, Locate, LocateFixed, LocateOff, Milestone,
  // === Money & Finance ===
  DollarSign, CircleDollarSign, BadgeDollarSign, Banknote, CreditCard,
  Wallet, WalletCards, PiggyBank, Coins, Calculator as CalculatorIcon,
  Receipt as ReceiptIcon, BadgePercent as BadgePercentIcon, HandCoins, Landmark,
  Scale, ScaleIcon, Vault,
  // === Saúde & Acessibilidade ===
  Stethoscope, Pill, Activity as ActivityIcon, Accessibility,
  Ear, EarOff, Brain as BrainIcon, Bone, Cross, Syringe,
  // === Clima ===
  Sun, SunMedium, SunDim, Moon, MoonStar, CloudSun, CloudMoon,
  CloudRain, CloudDrizzle, CloudSnow, CloudLightning, CloudFog, Cloudy,
  Snowflake, ThermometerSun, ThermometerSnowflake, Thermometer,
  Umbrella, Wind, Sunrise, Sunset, Rainbow, Tornado,
  // === Mídia · Play ===
  Play, PlayCircle, Pause, PauseCircle, StopCircle, Square as StopIcon,
  FastForward, Rewind, SkipBack, SkipForward,
  Volume2, Volume1, Volume, VolumeX, Volume2 as VolumeUp,
  Repeat, Repeat1, Shuffle, ListMusic, Radio, Podcast, Music2, Music3, Music4,
  // === Forma · Visual ===
  Square, Circle, Triangle, Hexagon, Pentagon, Octagon, Diamond,
  Star as StarShape, Heart as HeartShape, Sparkle, Shapes,
  // === Editor de texto ===
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  IndentIncrease, IndentDecrease, List as ListUnordered, ListOrdered, ListChecks, ListTodo,
  Quote as QuoteIcon, Code, Code2, FileCode, Link, Link2, Unlink,
  Heading1, Heading2, Heading3, Heading4, Heading5, Heading6,
  TextQuote, Pilcrow, RemoveFormatting, Superscript, Subscript,
  Type, CaseSensitive, CaseUpper, CaseLower,
  // === Comércio Brasil/Latam · CRM extras ===
  Boxes as BoxesIcon2, FolderHeart, BookOpen, Book, Notebook, NotebookPen,
  Newspaper, ClipboardCheck, ClipboardList, ClipboardSignature,
  Hand, ScrollText, ScanLine, ScanBarcode, QrCode, Barcode, Ticket,
} from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { Icon, iconSize, iconTone, type IconTone } from '@/components/ui/icon'
import { Input } from '@/components/ui/input'

interface IconEntry {
  icon: LucideIcon
  lucide: string
  semantic: string
}

interface IconGroup {
  id: string
  label: string
  italic: string
  description: string
  icons: IconEntry[]
}

const groups: IconGroup[] = [
  {
    id: 'actions',
    label: 'Ações',
    italic: 'verbos da interface',
    description: 'CRUD, filtros, navegação primária. Sempre em botões, dropdowns e toolbars.',
    icons: [
      { icon: Plus, lucide: 'Plus', semantic: 'Criar · adicionar · incluir' },
      { icon: PlusCircle, lucide: 'PlusCircle', semantic: 'Adicionar em círculo · ação enfatizada' },
      { icon: PlusSquare, lucide: 'PlusSquare', semantic: 'Adicionar em frame · UI editor' },
      { icon: Minus, lucide: 'Minus', semantic: 'Remover item · subtrair' },
      { icon: MinusCircle, lucide: 'MinusCircle', semantic: 'Remover em círculo · cancelar inclusão' },
      { icon: Pencil, lucide: 'Pencil', semantic: 'Editar · alterar valor' },
      { icon: Edit3, lucide: 'Edit3', semantic: 'Editar com hint · escrever' },
      { icon: SquarePen, lucide: 'SquarePen', semantic: 'Editar em card · inline' },
      { icon: Trash2, lucide: 'Trash2', semantic: 'Excluir · destrutivo · com confirmação' },
      { icon: Copy, lucide: 'Copy', semantic: 'Duplicar · copy' },
      { icon: ClipboardCopy, lucide: 'ClipboardCopy', semantic: 'Copiar para clipboard' },
      { icon: Clipboard, lucide: 'Clipboard', semantic: 'Clipboard genérico' },
      { icon: Save, lucide: 'Save', semantic: 'Salvar · persistir alterações' },
      { icon: Search, lucide: 'Search', semantic: 'Buscar · search global ou local' },
      { icon: SearchCheck, lucide: 'SearchCheck', semantic: 'Busca com resultado · matches' },
      { icon: SearchX, lucide: 'SearchX', semantic: 'Limpar busca · sem resultados' },
      { icon: Filter, lucide: 'Filter', semantic: 'Filtrar · refinar lista' },
      { icon: FilterX, lucide: 'FilterX', semantic: 'Limpar filtros' },
      { icon: SlidersHorizontal, lucide: 'SlidersHorizontal', semantic: 'Ajustes finos · filtros avançados' },
      { icon: Share, lucide: 'Share', semantic: 'Compartilhar · mobile-style' },
      { icon: Share2, lucide: 'Share2', semantic: 'Compartilhar · web · gerar link' },
      { icon: Send, lucide: 'Send', semantic: 'Enviar mensagem · submeter' },
      { icon: SendHorizontal, lucide: 'SendHorizontal', semantic: 'Enviar inline (chat composer)' },
      { icon: Download, lucide: 'Download', semantic: 'Baixar · exportar arquivo' },
      { icon: Upload, lucide: 'Upload', semantic: 'Enviar arquivo · upload' },
      { icon: RotateCw, lucide: 'RotateCw', semantic: 'Atualizar · refresh · retry' },
      { icon: RotateCcw, lucide: 'RotateCcw', semantic: 'Desfazer · voltar estado anterior' },
      { icon: RefreshCw, lucide: 'RefreshCw', semantic: 'Sincronizar · pull-to-refresh' },
      { icon: X, lucide: 'X', semantic: 'Fechar · remover tag · dismiss' },
      { icon: Check, lucide: 'Check', semantic: 'Confirmado · selecionado · sucesso' },
      { icon: CheckCheck, lucide: 'CheckCheck', semantic: 'Lido / entregue (WhatsApp-style)' },
      { icon: MoreHorizontal, lucide: 'MoreHorizontal', semantic: 'Menu de ações em linha · ⋯' },
      { icon: MoreVertical, lucide: 'MoreVertical', semantic: 'Menu de ações em coluna · ⋮' },
      { icon: Eye, lucide: 'Eye', semantic: 'Visualizar · ver senha · preview' },
      { icon: EyeOff, lucide: 'EyeOff', semantic: 'Ocultar · esconder senha' },
      { icon: Pin, lucide: 'Pin', semantic: 'Fixar · pin item' },
      { icon: PinOff, lucide: 'PinOff', semantic: 'Desafixar' },
      { icon: Bookmark, lucide: 'Bookmark', semantic: 'Salvar · marcar para depois' },
      { icon: BookmarkPlus, lucide: 'BookmarkPlus', semantic: 'Salvar novo bookmark' },
      { icon: Lock, lucide: 'Lock', semantic: 'Trancar · privado' },
      { icon: Unlock, lucide: 'Unlock', semantic: 'Destrancar · liberar' },
      { icon: ZoomIn, lucide: 'ZoomIn', semantic: 'Aproximar zoom · ampliar' },
      { icon: ZoomOut, lucide: 'ZoomOut', semantic: 'Afastar zoom · reduzir' },
    ],
  },
  {
    id: 'nav',
    label: 'Navegação',
    italic: 'direção · hierarquia · histórico',
    description: 'Chevrons disclosures · Arrows movimentos · Corners para diagrama.',
    icons: [
      { icon: ChevronDown, lucide: 'ChevronDown', semantic: 'Expandir dropdown' },
      { icon: ChevronUp, lucide: 'ChevronUp', semantic: 'Colapsar dropdown' },
      { icon: ChevronLeft, lucide: 'ChevronLeft', semantic: 'Anterior · prev page' },
      { icon: ChevronRight, lucide: 'ChevronRight', semantic: 'Próximo · separador · submenu' },
      { icon: ChevronsUpDown, lucide: 'ChevronsUpDown', semantic: 'Combobox · sort column' },
      { icon: ChevronsLeft, lucide: 'ChevronsLeft', semantic: 'Primeira página' },
      { icon: ChevronsRight, lucide: 'ChevronsRight', semantic: 'Última página' },
      { icon: ChevronsUp, lucide: 'ChevronsUp', semantic: 'Ir para o topo' },
      { icon: ChevronsDown, lucide: 'ChevronsDown', semantic: 'Ir para o fim' },
      { icon: ArrowUp, lucide: 'ArrowUp', semantic: 'Cima · subir · delta positivo' },
      { icon: ArrowDown, lucide: 'ArrowDown', semantic: 'Baixo · descer · delta negativo' },
      { icon: ArrowLeft, lucide: 'ArrowLeft', semantic: 'Voltar' },
      { icon: ArrowRight, lucide: 'ArrowRight', semantic: 'Continuar · CTA forward' },
      { icon: ArrowUpRight, lucide: 'ArrowUpRight', semantic: 'Crescimento · KPI up' },
      { icon: ArrowDownRight, lucide: 'ArrowDownRight', semantic: 'Queda · KPI down' },
      { icon: ArrowUpLeft, lucide: 'ArrowUpLeft', semantic: 'Voltar e subir' },
      { icon: ArrowDownLeft, lucide: 'ArrowDownLeft', semantic: 'Voltar e descer' },
      { icon: Home, lucide: 'Home', semantic: 'Home · cockpit · dashboard' },
      { icon: CornerDownLeft, lucide: 'CornerDownLeft', semantic: 'Enter / submit · return' },
      { icon: CornerDownRight, lucide: 'CornerDownRight', semantic: 'Resposta de threads' },
      { icon: CornerUpLeft, lucide: 'CornerUpLeft', semantic: 'Reply / quote' },
      { icon: CornerUpRight, lucide: 'CornerUpRight', semantic: 'Forward / share' },
      { icon: Undo, lucide: 'Undo', semantic: 'Desfazer · undo' },
      { icon: Redo, lucide: 'Redo', semantic: 'Refazer · redo' },
      { icon: Undo2, lucide: 'Undo2', semantic: 'Desfazer alt · pequeno' },
      { icon: Redo2, lucide: 'Redo2', semantic: 'Refazer alt · pequeno' },
      { icon: ExternalLink, lucide: 'ExternalLink', semantic: 'Abrir em nova aba · external' },
      { icon: MousePointer2, lucide: 'MousePointer2', semantic: 'Cursor · presence Figma-style' },
    ],
  },
  {
    id: 'structure',
    label: 'Estrutura',
    italic: 'view modes · containers',
    description: 'View-switchers, sidebars, panels, layouts.',
    icons: [
      { icon: LayoutDashboard, lucide: 'LayoutDashboard', semantic: 'Dashboard · cockpit' },
      { icon: LayoutGrid, lucide: 'LayoutGrid', semantic: 'View grade · cards' },
      { icon: LayoutList, lucide: 'LayoutList', semantic: 'View lista compacta' },
      { icon: LayoutTemplate, lucide: 'LayoutTemplate', semantic: 'Templates · layouts prontos' },
      { icon: LayoutPanelLeft, lucide: 'LayoutPanelLeft', semantic: 'Layout com painel esquerdo' },
      { icon: LayoutPanelTop, lucide: 'LayoutPanelTop', semantic: 'Layout com painel topo' },
      { icon: Sidebar, lucide: 'Sidebar', semantic: 'Toggle sidebar' },
      { icon: PanelLeft, lucide: 'PanelLeft', semantic: 'Painel esquerdo · abrir/fechar' },
      { icon: PanelRight, lucide: 'PanelRight', semantic: 'Painel direito · inspector' },
      { icon: PanelTop, lucide: 'PanelTop', semantic: 'Painel topo · topbar' },
      { icon: PanelBottom, lucide: 'PanelBottom', semantic: 'Painel rodapé · console' },
      { icon: List, lucide: 'List', semantic: 'View lista · linhas densas' },
      { icon: Rows3, lucide: 'Rows3', semantic: 'View tabela · 3 cols' },
      { icon: Rows4, lucide: 'Rows4', semantic: 'View tabela · density' },
      { icon: Columns3, lucide: 'Columns3', semantic: 'View kanban 3 colunas' },
      { icon: Columns4, lucide: 'Columns4', semantic: 'View kanban 4 colunas' },
      { icon: Grid2x2, lucide: 'Grid2x2', semantic: 'Grade 2×2' },
      { icon: Grid3x3, lucide: 'Grid3x3', semantic: 'Grade 3×3' },
      { icon: Boxes, lucide: 'Boxes', semantic: 'Módulos · catálogo · projetos' },
      { icon: Box, lucide: 'Box', semantic: 'Pacote · entidade isolada' },
      { icon: Folder, lucide: 'Folder', semantic: 'Pasta · agrupamento' },
      { icon: FolderOpen, lucide: 'FolderOpen', semantic: 'Pasta aberta · current' },
      { icon: FolderPlus, lucide: 'FolderPlus', semantic: 'Nova pasta' },
      { icon: FolderClosed, lucide: 'FolderClosed', semantic: 'Pasta fechada / arquivada' },
      { icon: FolderTree, lucide: 'FolderTree', semantic: 'Árvore de pastas · file explorer' },
      { icon: Network, lucide: 'Network', semantic: 'Relacionamentos · hierarquia' },
      { icon: Component, lucide: 'Component', semantic: 'Componente · design system atom' },
      { icon: Layers, lucide: 'Layers', semantic: 'Camadas · stack · variantes' },
      { icon: Layers2, lucide: 'Layers2', semantic: 'Camadas alt · sub-stack' },
      { icon: GalleryThumbnails, lucide: 'GalleryThumbnails', semantic: 'Galeria com thumbs · media' },
      { icon: GalleryHorizontal, lucide: 'GalleryHorizontal', semantic: 'Carrossel horizontal' },
    ],
  },
  {
    id: 'people',
    label: 'Pessoas',
    italic: 'identidade · papéis · grupos',
    description: 'Avatares semânticos, gestão de equipe, hierarquia.',
    icons: [
      { icon: User, lucide: 'User', semantic: 'Usuário individual · perfil' },
      { icon: UserRound, lucide: 'UserRound', semantic: 'Usuário arredondado · avatar' },
      { icon: UserPlus, lucide: 'UserPlus', semantic: 'Convidar usuário · novo membro' },
      { icon: UserRoundPlus, lucide: 'UserRoundPlus', semantic: 'Convidar arredondado' },
      { icon: UserMinus, lucide: 'UserMinus', semantic: 'Remover do squad' },
      { icon: UserCheck, lucide: 'UserCheck', semantic: 'Usuário verificado · approved' },
      { icon: UserX, lucide: 'UserX', semantic: 'Usuário bloqueado / rejeitado' },
      { icon: UserCog, lucide: 'UserCog', semantic: 'Configurar conta / permissões' },
      { icon: Users, lucide: 'Users', semantic: 'Equipe · squad · grupo' },
      { icon: UsersRound, lucide: 'UsersRound', semantic: 'Grupo arredondado · social' },
      { icon: Crown, lucide: 'Crown', semantic: 'CEO · Diretor · decisor' },
      { icon: Briefcase, lucide: 'Briefcase', semantic: 'Líder de squad · gestão' },
      { icon: AtSign, lucide: 'AtSign', semantic: '@mention · email · referência' },
      { icon: Contact, lucide: 'Contact', semantic: 'Contato · cartão de visita' },
      { icon: Contact2, lucide: 'Contact2', semantic: 'Contato 2 · phonebook' },
      { icon: Handshake, lucide: 'Handshake', semantic: 'Acordo · negociação · CRM deal won' },
      { icon: Baby, lucide: 'Baby', semantic: 'Cliente menor / dependente' },
      { icon: GraduationCap, lucide: 'GraduationCap', semantic: 'Treinamento · onboarding' },
      { icon: PersonStanding, lucide: 'PersonStanding', semantic: 'Acessibilidade · acessível' },
    ],
  },
  {
    id: 'status',
    label: 'Status & Feedback',
    italic: 'estados semânticos',
    description: 'Sempre pareados com a cor semântica TKWS.',
    icons: [
      { icon: CheckCircle2, lucide: 'CheckCircle2', semantic: 'Sucesso · aprovado · concluído' },
      { icon: CircleCheck, lucide: 'CircleCheck', semantic: 'Confirmado em círculo' },
      { icon: AlertTriangle, lucide: 'AlertTriangle', semantic: 'Atenção · warning · risco médio' },
      { icon: AlertCircle, lucide: 'AlertCircle', semantic: 'Alerta · risco alto' },
      { icon: AlertOctagon, lucide: 'AlertOctagon', semantic: 'Stop · ação bloqueada' },
      { icon: CircleAlert, lucide: 'CircleAlert', semantic: 'Atenção em círculo · alt' },
      { icon: XCircle, lucide: 'XCircle', semantic: 'Erro · rejeitado · falha' },
      { icon: CircleX, lucide: 'CircleX', semantic: 'Erro em círculo · alt' },
      { icon: Info, lucide: 'Info', semantic: 'Informativo · contextual hint' },
      { icon: Shield, lucide: 'Shield', semantic: 'Segurança · proteção' },
      { icon: ShieldCheck, lucide: 'ShieldCheck', semantic: 'Verificado · seguro · compliance' },
      { icon: ShieldAlert, lucide: 'ShieldAlert', semantic: 'Alerta de segurança · risco' },
      { icon: ShieldX, lucide: 'ShieldX', semantic: 'Bloqueado · acesso negado' },
      { icon: ShieldQuestion, lucide: 'ShieldQuestion', semantic: 'Permissão a definir' },
      { icon: Loader, lucide: 'Loader', semantic: 'Loader (dashed)' },
      { icon: Loader2, lucide: 'Loader2', semantic: 'Loader spinner · use com animate-spin' },
      { icon: CircleDashed, lucide: 'CircleDashed', semantic: 'Pendente · em rascunho' },
      { icon: Hourglass, lucide: 'Hourglass', semantic: 'Esperando · timer · em fila' },
      { icon: BellRing, lucide: 'BellRing', semantic: 'Notificação ativa · ring' },
      { icon: BellOff, lucide: 'BellOff', semantic: 'Mute · sem notificação' },
    ],
  },
  {
    id: 'time',
    label: 'Tempo',
    italic: 'data · prazo · histórico',
    description: 'Sempre 14-16px. Calendar = data específica. Clock = duração.',
    icons: [
      { icon: Calendar, lucide: 'Calendar', semantic: 'Data · datepicker' },
      { icon: CalendarDays, lucide: 'CalendarDays', semantic: 'Calendar com dias · view month' },
      { icon: CalendarRange, lucide: 'CalendarRange', semantic: 'Período · range picker' },
      { icon: CalendarClock, lucide: 'CalendarClock', semantic: 'Data + hora · agendamento' },
      { icon: CalendarCheck, lucide: 'CalendarCheck', semantic: 'Evento confirmado' },
      { icon: CalendarPlus, lucide: 'CalendarPlus', semantic: 'Novo evento' },
      { icon: CalendarMinus, lucide: 'CalendarMinus', semantic: 'Cancelar evento' },
      { icon: CalendarX, lucide: 'CalendarX', semantic: 'Sem data · indefinido' },
      { icon: CalendarHeart, lucide: 'CalendarHeart', semantic: 'Aniversário · evento especial' },
      { icon: Clock, lucide: 'Clock', semantic: 'Hora · duração · prazo' },
      { icon: Clock3, lucide: 'Clock3', semantic: 'Horário 3h · early' },
      { icon: Clock9, lucide: 'Clock9', semantic: 'Horário 9h · late' },
      { icon: Timer, lucide: 'Timer', semantic: 'Timer · contagem · pomodoro' },
      { icon: TimerReset, lucide: 'TimerReset', semantic: 'Resetar timer' },
      { icon: History, lucide: 'History', semantic: 'Histórico · activity log' },
      { icon: AlarmClock, lucide: 'AlarmClock', semantic: 'Lembrete · alarme' },
      { icon: AlarmClockCheck, lucide: 'AlarmClockCheck', semantic: 'Lembrete confirmado' },
    ],
  },
  {
    id: 'files',
    label: 'Arquivos & Mídia',
    italic: 'documentos · uploads · galerias',
    description: 'Tipos específicos: PDF, planilha, código, vídeo. Use lucide específico ou genérico.',
    icons: [
      { icon: File, lucide: 'File', semantic: 'Arquivo genérico' },
      { icon: FileText, lucide: 'FileText', semantic: 'Documento · briefing · ata' },
      { icon: FilePlus, lucide: 'FilePlus', semantic: 'Novo arquivo · upload' },
      { icon: FileMinus, lucide: 'FileMinus', semantic: 'Remover arquivo' },
      { icon: FileX, lucide: 'FileX', semantic: 'Arquivo com erro · inválido' },
      { icon: FileCheck, lucide: 'FileCheck', semantic: 'Arquivo validado' },
      { icon: FileSpreadsheet, lucide: 'FileSpreadsheet', semantic: 'Planilha · orçamento · CSV' },
      { icon: FileCode2, lucide: 'FileCode2', semantic: 'Arquivo de código · API · dev' },
      { icon: FileImage, lucide: 'FileImage', semantic: 'Imagem · render' },
      { icon: FileVideo, lucide: 'FileVideo', semantic: 'Vídeo · tutorial' },
      { icon: FileAudio, lucide: 'FileAudio', semantic: 'Áudio · gravação reunião' },
      { icon: FileArchive, lucide: 'FileArchive', semantic: 'Arquivo zipado' },
      { icon: FileType, lucide: 'FileType', semantic: 'Documento texto formatado' },
      { icon: FileType2, lucide: 'FileType2', semantic: 'Documento texto alt' },
      { icon: FolderArchive, lucide: 'FolderArchive', semantic: 'Pasta arquivada · old' },
      { icon: FolderSearch, lucide: 'FolderSearch', semantic: 'Buscar na pasta · scan' },
      { icon: ImageIcon, lucide: 'Image', semantic: 'Imagem · foto · render' },
      { icon: Images, lucide: 'Images', semantic: 'Galeria · múltiplas imagens' },
      { icon: Paperclip, lucide: 'Paperclip', semantic: 'Anexo · attachment' },
      { icon: Film, lucide: 'Film', semantic: 'Vídeo · cinema · timeline' },
      { icon: Music, lucide: 'Music', semantic: 'Música · audio' },
      { icon: Disc, lucide: 'Disc', semantic: 'CD/DVD · mídia física' },
    ],
  },
  {
    id: 'comm',
    label: 'Comunicação',
    italic: 'notificações · social · reações',
    description: 'Reactions usam SEMPRE lucide, não emoji nativo.',
    icons: [
      { icon: Bell, lucide: 'Bell', semantic: 'Notificação · sino' },
      { icon: MessageSquare, lucide: 'MessageSquare', semantic: 'Comentário · thread' },
      { icon: MessageCircle, lucide: 'MessageCircle', semantic: 'Chat síncrono · DM' },
      { icon: MessageCircleMore, lucide: 'MessageCircleMore', semantic: 'Chat com unread' },
      { icon: MessageSquareReply, lucide: 'MessageSquareReply', semantic: 'Responder thread' },
      { icon: Mail, lucide: 'Mail', semantic: 'Email · inbox' },
      { icon: MailOpen, lucide: 'MailOpen', semantic: 'Email lido / aberto' },
      { icon: MailPlus, lucide: 'MailPlus', semantic: 'Novo email' },
      { icon: MailCheck, lucide: 'MailCheck', semantic: 'Email entregue / confirmado' },
      { icon: Phone, lucide: 'Phone', semantic: 'Telefone · WhatsApp' },
      { icon: PhoneCall, lucide: 'PhoneCall', semantic: 'Em ligação' },
      { icon: PhoneIncoming, lucide: 'PhoneIncoming', semantic: 'Ligação recebida' },
      { icon: PhoneOutgoing, lucide: 'PhoneOutgoing', semantic: 'Ligação efetuada' },
      { icon: PhoneOff, lucide: 'PhoneOff', semantic: 'Sem ligação · DND' },
      { icon: Reply, lucide: 'Reply', semantic: 'Responder' },
      { icon: Forward, lucide: 'Forward', semantic: 'Encaminhar' },
      { icon: ThumbsUp, lucide: 'ThumbsUp', semantic: 'Like · positiva' },
      { icon: ThumbsDown, lucide: 'ThumbsDown', semantic: 'Dislike · negativa' },
      { icon: Heart, lucide: 'Heart', semantic: 'Favoritar · wish' },
      { icon: HeartPulse, lucide: 'HeartPulse', semantic: 'Live · saúde · pulse' },
      { icon: Star, lucide: 'Star', semantic: 'Rating · avaliação' },
      { icon: BookmarkIcon, lucide: 'Bookmark', semantic: 'Salvar para depois' },
      { icon: Tag, lucide: 'Tag', semantic: 'Tag · categoria' },
      { icon: Tags, lucide: 'Tags', semantic: 'Múltiplas tags' },
      { icon: Quote, lucide: 'Quote', semantic: 'Citação · quote · testimonial' },
      { icon: Megaphone, lucide: 'Megaphone', semantic: 'Anúncio · marketing' },
      { icon: Speech, lucide: 'Speech', semantic: 'Fala · transcrição · voice' },
    ],
  },
  {
    id: 'data',
    label: 'Dados & KPIs',
    italic: 'gráficos · métricas · números',
    description: 'Para KPI cards, charts, dashboards e analytics.',
    icons: [
      { icon: TrendingUp, lucide: 'TrendingUp', semantic: 'Crescimento · delta positivo (success)' },
      { icon: TrendingDown, lucide: 'TrendingDown', semantic: 'Queda · delta negativo (danger)' },
      { icon: BarChart3, lucide: 'BarChart3', semantic: 'Bar chart · análise' },
      { icon: BarChart4, lucide: 'BarChart4', semantic: 'Bar chart com 4 séries' },
      { icon: BarChartBig, lucide: 'BarChartBig', semantic: 'Bar chart visualização ampla' },
      { icon: BarChartHorizontal, lucide: 'BarChartHorizontal', semantic: 'Bar chart horizontal' },
      { icon: LineChart, lucide: 'LineChart', semantic: 'Line chart · tendência' },
      { icon: AreaChart, lucide: 'AreaChart', semantic: 'Area chart · soma cumulativa' },
      { icon: PieChart, lucide: 'PieChart', semantic: 'Pie chart · distribuição' },
      { icon: ScatterChart, lucide: 'ScatterChart', semantic: 'Scatter · correlação' },
      { icon: Activity, lucide: 'Activity', semantic: 'Pulse · live · activity feed' },
      { icon: ActivitySquare, lucide: 'ActivitySquare', semantic: 'Activity em frame' },
      { icon: Target, lucide: 'Target', semantic: 'Meta · OKR · north star' },
      { icon: Sigma, lucide: 'Sigma', semantic: 'Soma · agregação' },
      { icon: Percent, lucide: 'Percent', semantic: 'Percentual · taxa' },
      { icon: BadgePercent, lucide: 'BadgePercent', semantic: 'Desconto · promo' },
      { icon: Calculator, lucide: 'Calculator', semantic: 'Calculadora · cotação' },
      { icon: Hash, lucide: 'Hash', semantic: 'Número · ID · código' },
    ],
  },
  {
    id: 'domain',
    label: 'Domínio · Arquitetura',
    italic: 'TKWS-specific · ofício · móveis',
    description: 'Léxico do nicho · obra, móveis, ambientes. Use no catálogo, planta e specs.',
    icons: [
      { icon: Building, lucide: 'Building', semantic: 'Edifício · empresa' },
      { icon: Building2, lucide: 'Building2', semantic: 'Projeto · empreendimento' },
      { icon: HardHat, lucide: 'HardHat', semantic: 'Obra · canteiro · gestor' },
      { icon: Hammer, lucide: 'Hammer', semantic: 'Execução · build' },
      { icon: Wrench, lucide: 'Wrench', semantic: 'Manutenção · ajuste' },
      { icon: Construction, lucide: 'Construction', semantic: 'Em construção · feature flag' },
      { icon: Paintbrush, lucide: 'Paintbrush', semantic: 'Acabamento · pintura' },
      { icon: PaintBucket, lucide: 'PaintBucket', semantic: 'Preenchimento de cor · tinta' },
      { icon: Ruler, lucide: 'Ruler', semantic: 'Medida · dimensões' },
      { icon: Compass, lucide: 'Compass', semantic: 'Orientação norte · planta' },
      { icon: Pickaxe, lucide: 'Pickaxe', semantic: 'Demolição · obra bruta' },
      { icon: Shovel, lucide: 'Shovel', semantic: 'Escavação · fundação' },
      { icon: ToyBrick, lucide: 'ToyBrick', semantic: 'Bloco · modular' },
      { icon: Lamp, lucide: 'Lamp', semantic: 'Iluminação · luminária' },
      { icon: LampCeiling, lucide: 'LampCeiling', semantic: 'Lustre · luz teto' },
      { icon: LampDesk, lucide: 'LampDesk', semantic: 'Abajur · luz de mesa' },
      { icon: LampFloor, lucide: 'LampFloor', semantic: 'Luminária de chão' },
      { icon: LampWallUp, lucide: 'LampWallUp', semantic: 'Arandela superior' },
      { icon: LampWallDown, lucide: 'LampWallDown', semantic: 'Arandela inferior' },
      { icon: Sofa, lucide: 'Sofa', semantic: 'Living · estofado' },
      { icon: Armchair, lucide: 'Armchair', semantic: 'Poltrona' },
      { icon: Bed, lucide: 'Bed', semantic: 'Dormitório · ambiente' },
      { icon: BedDouble, lucide: 'BedDouble', semantic: 'Cama de casal' },
      { icon: BedSingle, lucide: 'BedSingle', semantic: 'Cama solteiro' },
      { icon: Bath, lucide: 'Bath', semantic: 'BWC · banheiro' },
      { icon: ChefHat, lucide: 'ChefHat', semantic: 'Cozinha gourmet · chef' },
      { icon: CookingPot, lucide: 'CookingPot', semantic: 'Cozinha · panela' },
      { icon: Utensils, lucide: 'Utensils', semantic: 'Mesa de jantar · talheres' },
      { icon: Refrigerator, lucide: 'Refrigerator', semantic: 'Geladeira · eletro' },
      { icon: Microwave, lucide: 'Microwave', semantic: 'Microondas · eletro' },
      { icon: DoorOpen, lucide: 'DoorOpen', semantic: 'Acesso · entrada' },
      { icon: DoorClosed, lucide: 'DoorClosed', semantic: 'Fechado · acesso negado' },
      { icon: Trees, lucide: 'Trees', semantic: 'Paisagismo · jardim' },
      { icon: TreePine, lucide: 'TreePine', semantic: 'Pinheiro · outdoor' },
      { icon: ParkingMeter, lucide: 'ParkingMeter', semantic: 'Vaga · garagem' },
    ],
  },
  {
    id: 'commerce',
    label: 'Comércio & Logística',
    italic: 'e-commerce · entrega · cadeia',
    description: 'Para catálogo, carrinho, checkout, rastreamento.',
    icons: [
      { icon: ShoppingCart, lucide: 'ShoppingCart', semantic: 'Sacola · catálogo · checkout' },
      { icon: ShoppingBag, lucide: 'ShoppingBag', semantic: 'Sacola mobile · compras' },
      { icon: ShoppingBasket, lucide: 'ShoppingBasket', semantic: 'Cesta · compras quick' },
      { icon: Store, lucide: 'Store', semantic: 'Loja · fornecedor' },
      { icon: Warehouse, lucide: 'Warehouse', semantic: 'Estoque · depósito' },
      { icon: Gift, lucide: 'Gift', semantic: 'Brinde · cashback · cupom' },
      { icon: Receipt, lucide: 'Receipt', semantic: 'NF · cupom fiscal' },
      { icon: ReceiptText, lucide: 'ReceiptText', semantic: 'NF detalhada' },
      { icon: Package, lucide: 'Package', semantic: 'Pacote · item embalado' },
      { icon: PackageOpen, lucide: 'PackageOpen', semantic: 'Pacote aberto · entregue' },
      { icon: PackageCheck, lucide: 'PackageCheck', semantic: 'Pacote validado · OK' },
      { icon: PackageX, lucide: 'PackageX', semantic: 'Pacote inválido · devolvido' },
      { icon: Container, lucide: 'Container', semantic: 'Container · transporte longo' },
      { icon: Forklift, lucide: 'Forklift', semantic: 'Empilhadeira · armazém' },
      { icon: Truck, lucide: 'Truck', semantic: 'Entrega · frete' },
      { icon: Ship, lucide: 'Ship', semantic: 'Navio · importação' },
      { icon: Plane, lucide: 'Plane', semantic: 'Aéreo · expresso' },
      { icon: Train, lucide: 'Train', semantic: 'Ferroviário · volume' },
      { icon: Car, lucide: 'Car', semantic: 'Carro · transporte leve' },
      { icon: Bus, lucide: 'Bus', semantic: 'Ônibus · time' },
      { icon: Bike, lucide: 'Bike', semantic: 'Motoboy · entrega rápida' },
      { icon: Anchor, lucide: 'Anchor', semantic: 'Porto · âncora · marítimo' },
      { icon: Ticket, lucide: 'Ticket', semantic: 'Ticket · ingresso' },
      { icon: Barcode, lucide: 'Barcode', semantic: 'Código de barras' },
      { icon: QrCode, lucide: 'QrCode', semantic: 'QR Code · pagamento Pix' },
      { icon: ScanLine, lucide: 'ScanLine', semantic: 'Scanner · leitor' },
      { icon: ScanBarcode, lucide: 'ScanBarcode', semantic: 'Scan código de barras' },
    ],
  },
  {
    id: 'money',
    label: 'Money & Finance',
    italic: 'BRL · pagamento · contábil',
    description: 'Use no módulo Financeiro, faturas, contratos, cotações.',
    icons: [
      { icon: DollarSign, lucide: 'DollarSign', semantic: 'USD · genérico moeda' },
      { icon: CircleDollarSign, lucide: 'CircleDollarSign', semantic: 'Dinheiro em círculo' },
      { icon: BadgeDollarSign, lucide: 'BadgeDollarSign', semantic: 'Preço destacado' },
      { icon: Banknote, lucide: 'Banknote', semantic: 'Cédula · dinheiro físico' },
      { icon: Coins, lucide: 'Coins', semantic: 'Moedas · troco' },
      { icon: HandCoins, lucide: 'HandCoins', semantic: 'Receber · pagamento entrante' },
      { icon: PiggyBank, lucide: 'PiggyBank', semantic: 'Poupança · economia' },
      { icon: CreditCard, lucide: 'CreditCard', semantic: 'Cartão · pagamento online' },
      { icon: Wallet, lucide: 'Wallet', semantic: 'Carteira · saldo' },
      { icon: WalletCards, lucide: 'WalletCards', semantic: 'Múltiplos cartões' },
      { icon: Vault, lucide: 'Vault', semantic: 'Cofre · reserva · seguro' },
      { icon: Landmark, lucide: 'Landmark', semantic: 'Banco · governo · institucional' },
      { icon: Receipt, lucide: 'Receipt', semantic: 'NF · cupom' },
      { icon: BadgePercent, lucide: 'BadgePercent', semantic: 'Desconto · promo' },
      { icon: Scale, lucide: 'Scale', semantic: 'Balança · margem' },
      { icon: CalculatorIcon, lucide: 'Calculator', semantic: 'Calculadora · cotação' },
    ],
  },
  {
    id: 'system',
    label: 'Sistema',
    italic: 'config · infra · IA',
    description: 'Backend, DevOps, IA, dispositivos.',
    icons: [
      { icon: Settings, lucide: 'Settings', semantic: 'Configurações' },
      { icon: Settings2, lucide: 'Settings2', semantic: 'Configurações avançadas' },
      { icon: Cog, lucide: 'Cog', semantic: 'Engrenagem · ajustes finos' },
      { icon: Key, lucide: 'Key', semantic: 'Credencial · API key' },
      { icon: KeyRound, lucide: 'KeyRound', semantic: 'Senha · login' },
      { icon: KeySquare, lucide: 'KeySquare', semantic: 'Chave secundária · 2FA' },
      { icon: Globe, lucide: 'Globe', semantic: 'Público · web' },
      { icon: Globe2, lucide: 'Globe2', semantic: 'Internacional · localização' },
      { icon: Database, lucide: 'Database', semantic: 'Banco de dados' },
      { icon: DatabaseBackup, lucide: 'DatabaseBackup', semantic: 'Backup · snapshot' },
      { icon: Server, lucide: 'Server', semantic: 'Servidor · backend' },
      { icon: ServerOff, lucide: 'ServerOff', semantic: 'Servidor offline · 500' },
      { icon: ServerCog, lucide: 'ServerCog', semantic: 'Servidor em config' },
      { icon: Cpu, lucide: 'Cpu', semantic: 'CPU · processamento' },
      { icon: MemoryStick, lucide: 'MemoryStick', semantic: 'Memória RAM' },
      { icon: HardDrive, lucide: 'HardDrive', semantic: 'Armazenamento · disco' },
      { icon: Cloud, lucide: 'Cloud', semantic: 'Nuvem · cloud' },
      { icon: CloudOff, lucide: 'CloudOff', semantic: 'Offline · sem nuvem' },
      { icon: CloudUpload, lucide: 'CloudUpload', semantic: 'Sync para nuvem' },
      { icon: CloudDownload, lucide: 'CloudDownload', semantic: 'Baixar da nuvem' },
      { icon: Wifi, lucide: 'Wifi', semantic: 'Wi-Fi conectado' },
      { icon: WifiOff, lucide: 'WifiOff', semantic: 'Offline · sem conexão' },
      { icon: Bluetooth, lucide: 'Bluetooth', semantic: 'Bluetooth' },
      { icon: Power, lucide: 'Power', semantic: 'Ligar' },
      { icon: PowerOff, lucide: 'PowerOff', semantic: 'Desligar' },
      { icon: Plug, lucide: 'Plug', semantic: 'Tomada · integração / conector' },
      { icon: Sparkles, lucide: 'Sparkles', semantic: 'IA · Lúmen · auto suggestion' },
      { icon: Bot, lucide: 'Bot', semantic: 'Bot · automação' },
      { icon: Brain, lucide: 'Brain', semantic: 'IA cognitiva · reasoning' },
      { icon: Atom, lucide: 'Atom', semantic: 'Atomic · primitive · ciência' },
      { icon: TestTube, lucide: 'TestTube', semantic: 'Experimento · feature flag' },
      { icon: Flame, lucide: 'Flame', semantic: 'Em alta · trending · hot' },
      { icon: Zap, lucide: 'Zap', semantic: 'Energia · rápido · ⚡ shortcut' },
    ],
  },
  {
    id: 'devices',
    label: 'Devices',
    italic: 'mobile · web · IoT',
    description: 'Para responsive views, settings, mobile patterns.',
    icons: [
      { icon: Smartphone, lucide: 'Smartphone', semantic: 'Mobile · app Capacitor' },
      { icon: Tablet, lucide: 'Tablet', semantic: 'iPad / Android tablet' },
      { icon: Monitor, lucide: 'Monitor', semantic: 'Desktop · workstation' },
      { icon: Laptop, lucide: 'Laptop', semantic: 'Notebook · mobile work' },
      { icon: MonitorSmartphone, lucide: 'MonitorSmartphone', semantic: 'Responsive · multi-device' },
      { icon: Watch, lucide: 'Watch', semantic: 'Smartwatch · wearable' },
      { icon: Tv, lucide: 'Tv', semantic: 'TV · display large' },
      { icon: Tv2, lucide: 'Tv2', semantic: 'TV alt · monitor secundário' },
      { icon: Headphones, lucide: 'Headphones', semantic: 'Áudio · focus mode' },
      { icon: Mic, lucide: 'Mic', semantic: 'Microfone · gravar' },
      { icon: MicOff, lucide: 'MicOff', semantic: 'Mic mute' },
      { icon: Camera, lucide: 'Camera', semantic: 'Câmera · foto · punch list' },
      { icon: CameraOff, lucide: 'CameraOff', semantic: 'Câmera off' },
      { icon: Mouse, lucide: 'Mouse', semantic: 'Mouse · ponteiro' },
      { icon: Keyboard, lucide: 'Keyboard', semantic: 'Teclado · atalhos' },
      { icon: BatteryFull, lucide: 'BatteryFull', semantic: 'Bateria cheia' },
      { icon: BatteryMedium, lucide: 'BatteryMedium', semantic: 'Bateria média' },
      { icon: BatteryLow, lucide: 'BatteryLow', semantic: 'Bateria baixa' },
      { icon: BatteryWarning, lucide: 'BatteryWarning', semantic: 'Bateria crítica' },
      { icon: BatteryCharging, lucide: 'BatteryCharging', semantic: 'Carregando' },
      { icon: Signal, lucide: 'Signal', semantic: 'Sinal cheio' },
      { icon: SignalHigh, lucide: 'SignalHigh', semantic: 'Sinal alto' },
      { icon: SignalLow, lucide: 'SignalLow', semantic: 'Sinal baixo' },
      { icon: SignalZero, lucide: 'SignalZero', semantic: 'Sem sinal' },
    ],
  },
  {
    id: 'location',
    label: 'Localização',
    italic: 'mapa · GPS · endereço',
    description: 'Para endereços, mapas, planta de obra.',
    icons: [
      { icon: MapPin, lucide: 'MapPin', semantic: 'Pin no mapa · endereço' },
      { icon: MapPinned, lucide: 'MapPinned', semantic: 'Localização confirmada' },
      { icon: Map, lucide: 'Map', semantic: 'Mapa completo' },
      { icon: Navigation, lucide: 'Navigation', semantic: 'Direção · current location' },
      { icon: Navigation2, lucide: 'Navigation2', semantic: 'Direção alt · navegação ativa' },
      { icon: CompassIcon, lucide: 'Compass', semantic: 'Bússola · orientação' },
      { icon: Flag, lucide: 'Flag', semantic: 'Bandeira · marco · milestone' },
      { icon: FlagTriangleRight, lucide: 'FlagTriangleRight', semantic: 'Bandeira triangular · checkpoint' },
      { icon: Milestone, lucide: 'Milestone', semantic: 'Marco · fase do projeto' },
      { icon: LandPlot, lucide: 'LandPlot', semantic: 'Lote · terreno' },
      { icon: Mountain, lucide: 'Mountain', semantic: 'Outdoor · terreno acidentado' },
      { icon: Route, lucide: 'Route', semantic: 'Rota · caminho' },
      { icon: Crosshair, lucide: 'Crosshair', semantic: 'Foco · precision' },
      { icon: Locate, lucide: 'Locate', semantic: 'Localizar me' },
      { icon: LocateFixed, lucide: 'LocateFixed', semantic: 'Localização fixada' },
      { icon: LocateOff, lucide: 'LocateOff', semantic: 'Localização desligada' },
    ],
  },
  {
    id: 'weather',
    label: 'Clima',
    italic: 'sol · chuva · temperatura',
    description: 'Para previsão (planejamento de obra outdoor), modo claro/escuro, sazonalidade.',
    icons: [
      { icon: Sun, lucide: 'Sun', semantic: 'Sol · light theme · diurno' },
      { icon: SunMedium, lucide: 'SunMedium', semantic: 'Sol médio · meio-dia' },
      { icon: SunDim, lucide: 'SunDim', semantic: 'Sol fraco · entardecer' },
      { icon: Sunrise, lucide: 'Sunrise', semantic: 'Nascer do sol' },
      { icon: Sunset, lucide: 'Sunset', semantic: 'Pôr do sol' },
      { icon: Moon, lucide: 'Moon', semantic: 'Lua · dark theme · noturno' },
      { icon: MoonStar, lucide: 'MoonStar', semantic: 'Noite estrelada · DND' },
      { icon: CloudSun, lucide: 'CloudSun', semantic: 'Sol entre nuvens · parcial' },
      { icon: CloudMoon, lucide: 'CloudMoon', semantic: 'Lua entre nuvens' },
      { icon: Cloudy, lucide: 'Cloudy', semantic: 'Nublado' },
      { icon: CloudRain, lucide: 'CloudRain', semantic: 'Chuva · adiar obra outdoor' },
      { icon: CloudDrizzle, lucide: 'CloudDrizzle', semantic: 'Garoa fina' },
      { icon: CloudSnow, lucide: 'CloudSnow', semantic: 'Neve' },
      { icon: CloudLightning, lucide: 'CloudLightning', semantic: 'Trovoada · raio' },
      { icon: CloudFog, lucide: 'CloudFog', semantic: 'Neblina' },
      { icon: Snowflake, lucide: 'Snowflake', semantic: 'Frio · congelado · feature freeze' },
      { icon: Wind, lucide: 'Wind', semantic: 'Vento · ventilação' },
      { icon: Umbrella, lucide: 'Umbrella', semantic: 'Guarda-chuva · proteção' },
      { icon: Rainbow, lucide: 'Rainbow', semantic: 'Arco-íris · diversidade' },
      { icon: Tornado, lucide: 'Tornado', semantic: 'Tornado · evento extremo' },
      { icon: Thermometer, lucide: 'Thermometer', semantic: 'Temperatura' },
      { icon: ThermometerSun, lucide: 'ThermometerSun', semantic: 'Calor · quente' },
      { icon: ThermometerSnowflake, lucide: 'ThermometerSnowflake', semantic: 'Frio' },
    ],
  },
  {
    id: 'media-play',
    label: 'Mídia · Play',
    italic: 'audio · vídeo · controles',
    description: 'Para tutoriais, player de vídeo, gravações.',
    icons: [
      { icon: Play, lucide: 'Play', semantic: 'Play · iniciar' },
      { icon: PlayCircle, lucide: 'PlayCircle', semantic: 'Play em círculo · tutorial' },
      { icon: Pause, lucide: 'Pause', semantic: 'Pausar' },
      { icon: PauseCircle, lucide: 'PauseCircle', semantic: 'Pausar em círculo' },
      { icon: StopCircle, lucide: 'StopCircle', semantic: 'Parar / encerrar' },
      { icon: StopIcon, lucide: 'Square', semantic: 'Stop · stop recording' },
      { icon: FastForward, lucide: 'FastForward', semantic: 'Avançar rápido · 2×' },
      { icon: Rewind, lucide: 'Rewind', semantic: 'Voltar rápido' },
      { icon: SkipBack, lucide: 'SkipBack', semantic: 'Anterior faixa' },
      { icon: SkipForward, lucide: 'SkipForward', semantic: 'Próxima faixa' },
      { icon: Volume2, lucide: 'Volume2', semantic: 'Volume alto' },
      { icon: Volume1, lucide: 'Volume1', semantic: 'Volume médio' },
      { icon: Volume, lucide: 'Volume', semantic: 'Volume baixo' },
      { icon: VolumeX, lucide: 'VolumeX', semantic: 'Mudo' },
      { icon: Repeat, lucide: 'Repeat', semantic: 'Repetir lista' },
      { icon: Repeat1, lucide: 'Repeat1', semantic: 'Repetir faixa única' },
      { icon: Shuffle, lucide: 'Shuffle', semantic: 'Aleatório · shuffle' },
      { icon: ListMusic, lucide: 'ListMusic', semantic: 'Playlist' },
      { icon: Radio, lucide: 'Radio', semantic: 'Rádio · streaming live' },
      { icon: Podcast, lucide: 'Podcast', semantic: 'Podcast · áudio episódio' },
    ],
  },
  {
    id: 'shape',
    label: 'Formas & Visual',
    italic: 'geometria · destaque',
    description: 'Use em badges decorativos, swatches, ilustrações inline.',
    icons: [
      { icon: Square, lucide: 'Square', semantic: 'Quadrado · checkbox vazio' },
      { icon: Circle, lucide: 'Circle', semantic: 'Círculo · radio vazio · status dot' },
      { icon: Triangle, lucide: 'Triangle', semantic: 'Triângulo · play minimal' },
      { icon: Hexagon, lucide: 'Hexagon', semantic: 'Hexágono · cell honeycomb' },
      { icon: Pentagon, lucide: 'Pentagon', semantic: 'Pentágono · forma decorativa' },
      { icon: Octagon, lucide: 'Octagon', semantic: 'Octógono · stop sign' },
      { icon: Diamond, lucide: 'Diamond', semantic: 'Diamante · premium' },
      { icon: StarShape, lucide: 'Star', semantic: 'Estrela · destaque' },
      { icon: HeartShape, lucide: 'Heart', semantic: 'Coração · amor / fav' },
      { icon: Sparkle, lucide: 'Sparkle', semantic: 'Brilho · single · destaque' },
      { icon: Shapes, lucide: 'Shapes', semantic: 'Formas mistas · canvas' },
    ],
  },
  {
    id: 'text-editor',
    label: 'Editor de Texto',
    italic: 'rich text · markdown',
    description: 'Toolbar de editor (briefing, atas, ata-de-reunião, AI prompt).',
    icons: [
      { icon: Bold, lucide: 'Bold', semantic: 'Negrito' },
      { icon: Italic, lucide: 'Italic', semantic: 'Itálico' },
      { icon: Underline, lucide: 'Underline', semantic: 'Sublinhado' },
      { icon: Strikethrough, lucide: 'Strikethrough', semantic: 'Tachado' },
      { icon: AlignLeft, lucide: 'AlignLeft', semantic: 'Alinhar esquerda' },
      { icon: AlignCenter, lucide: 'AlignCenter', semantic: 'Centralizar' },
      { icon: AlignRight, lucide: 'AlignRight', semantic: 'Alinhar direita' },
      { icon: AlignJustify, lucide: 'AlignJustify', semantic: 'Justificado' },
      { icon: IndentIncrease, lucide: 'IndentIncrease', semantic: 'Aumentar indent · tab' },
      { icon: IndentDecrease, lucide: 'IndentDecrease', semantic: 'Diminuir indent · outdent' },
      { icon: ListUnordered, lucide: 'List', semantic: 'Lista com bullets' },
      { icon: ListOrdered, lucide: 'ListOrdered', semantic: 'Lista numerada' },
      { icon: ListChecks, lucide: 'ListChecks', semantic: 'Checklist' },
      { icon: ListTodo, lucide: 'ListTodo', semantic: 'To-do list' },
      { icon: QuoteIcon, lucide: 'Quote', semantic: 'Citação · blockquote' },
      { icon: TextQuote, lucide: 'TextQuote', semantic: 'Quote inline' },
      { icon: Code, lucide: 'Code', semantic: 'Código inline · `code`' },
      { icon: Code2, lucide: 'Code2', semantic: 'Bloco de código · ```' },
      { icon: FileCode, lucide: 'FileCode', semantic: 'Arquivo de código' },
      { icon: Link, lucide: 'Link', semantic: 'Link · href' },
      { icon: Link2, lucide: 'Link2', semantic: 'Link alt · cadeia' },
      { icon: Unlink, lucide: 'Unlink', semantic: 'Remover link' },
      { icon: Heading1, lucide: 'Heading1', semantic: 'H1 · título principal' },
      { icon: Heading2, lucide: 'Heading2', semantic: 'H2 · subtítulo' },
      { icon: Heading3, lucide: 'Heading3', semantic: 'H3 · seção' },
      { icon: Heading4, lucide: 'Heading4', semantic: 'H4' },
      { icon: Heading5, lucide: 'Heading5', semantic: 'H5' },
      { icon: Heading6, lucide: 'Heading6', semantic: 'H6 · menor' },
      { icon: Type, lucide: 'Type', semantic: 'Tipografia · texto' },
      { icon: CaseSensitive, lucide: 'CaseSensitive', semantic: 'Maiúsc/minúsc · case-sensitive' },
      { icon: CaseUpper, lucide: 'CaseUpper', semantic: 'CAIXA ALTA' },
      { icon: CaseLower, lucide: 'CaseLower', semantic: 'caixa baixa' },
      { icon: Pilcrow, lucide: 'Pilcrow', semantic: 'Parágrafo · ¶' },
      { icon: RemoveFormatting, lucide: 'RemoveFormatting', semantic: 'Remover formatação' },
      { icon: Superscript, lucide: 'Superscript', semantic: 'Sobrescrito · x²' },
      { icon: Subscript, lucide: 'Subscript', semantic: 'Subscrito · H₂O' },
    ],
  },
  {
    id: 'health',
    label: 'Saúde & Acessibilidade',
    italic: 'A11y · bem-estar',
    description: 'Para a11y, segurança no trabalho, indicadores de saúde do projeto.',
    icons: [
      { icon: HeartPulse, lucide: 'HeartPulse', semantic: 'Pulse · health check · live' },
      { icon: ActivityIcon, lucide: 'Activity', semantic: 'Activity · vital signs' },
      { icon: Stethoscope, lucide: 'Stethoscope', semantic: 'Diagnóstico · health check' },
      { icon: Pill, lucide: 'Pill', semantic: 'Medicamento · solução · fix' },
      { icon: Syringe, lucide: 'Syringe', semantic: 'Injeção · injection · hotfix' },
      { icon: Cross, lucide: 'Cross', semantic: 'Saúde · cruz médica' },
      { icon: Bone, lucide: 'Bone', semantic: 'Estrutura · bone broken' },
      { icon: BrainIcon, lucide: 'Brain', semantic: 'Cérebro · cognição' },
      { icon: Accessibility, lucide: 'Accessibility', semantic: 'A11y · acessibilidade' },
      { icon: Ear, lucide: 'Ear', semantic: 'Ouvir · audio acessível' },
      { icon: EarOff, lucide: 'EarOff', semantic: 'Surdo · sem áudio' },
    ],
  },
  {
    id: 'docs',
    label: 'Documentação & Notas',
    italic: 'briefing · ata · post-its',
    description: 'Para briefings, notas, atas, recados.',
    icons: [
      { icon: BookOpen, lucide: 'BookOpen', semantic: 'Documentação · ler' },
      { icon: Book, lucide: 'Book', semantic: 'Livro · manual fechado' },
      { icon: Notebook, lucide: 'Notebook', semantic: 'Caderno · notas estruturadas' },
      { icon: NotebookPen, lucide: 'NotebookPen', semantic: 'Anotar · brain dump' },
      { icon: Newspaper, lucide: 'Newspaper', semantic: 'Notícia · changelog' },
      { icon: ClipboardList, lucide: 'ClipboardList', semantic: 'Lista de tarefas' },
      { icon: ClipboardCheck, lucide: 'ClipboardCheck', semantic: 'Lista validada' },
      { icon: ClipboardSignature, lucide: 'ClipboardSignature', semantic: 'Assinatura · contrato' },
      { icon: Hand, lucide: 'Hand', semantic: 'Mão · raise hand · standby' },
      { icon: ScrollText, lucide: 'ScrollText', semantic: 'Pergaminho · termos longos' },
      { icon: FolderHeart, lucide: 'FolderHeart', semantic: 'Pasta favorita' },
    ],
  },
]

const totalIcons = groups.reduce((a, g) => a + g.icons.length, 0)

const tonesOrder: IconTone[] = ['default', 'brand', 'success', 'warning', 'alert', 'danger', 'purple', 'pink', 'muted']
const sizesOrder = Object.keys(iconSize) as (keyof typeof iconSize)[]
const strokeWeights = [1.5, 1.7, 2, 2.4]

export function IconographyPage() {
  const [query, setQuery] = React.useState('')
  const [activeGroup, setActiveGroup] = React.useState<string | 'all'>('all')
  const q = query.trim().toLowerCase()

  const filteredGroups = React.useMemo(() => {
    return groups
      .filter((g) => activeGroup === 'all' || g.id === activeGroup)
      .map((g) => ({
        ...g,
        icons: g.icons.filter(
          (i) =>
            !q ||
            i.lucide.toLowerCase().includes(q) ||
            i.semantic.toLowerCase().includes(q) ||
            g.label.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.icons.length > 0)
  }, [q, activeGroup])

  const visibleCount = filteredGroups.reduce((a, g) => a + g.icons.length, 0)

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        num="04.1"
        category="Fundamentos · Iconografia"
        title="Iconografia"
        italic={`lucide · ${totalIcons} ícones curados em ${groups.length} categorias`}
        description="Sistema de ícones com biblioteca curada. Toda a interface usa lucide-react com strokeWidth 1.7 (peso editorial). Sizes semânticos, tons via CSS vars, semântica explícita por categoria."
        tag={`${totalIcons} ícones`}
      />

      <SubHead num="A" title="Anatomia · o atom Icon" italic="centralizado em src/components/atoms/icon.tsx" />
      <Showcase>
        <div className="grid grid-cols-2 gap-5 max-[760px]:grid-cols-1">
          <div
            className="rounded-[12px] border p-5"
            style={{ background: 'var(--surface-1)', borderColor: 'var(--line-2)' }}
          >
            <h4 className="serif text-[18px] font-normal" style={{ color: 'var(--text)' }}>
              Por que um Icon atom?
            </h4>
            <ul className="mt-3 flex flex-col gap-2 text-[13px]" style={{ color: 'var(--text-soft)' }}>
              <li><b style={{ color: 'var(--text)' }}>Defaults TKWS:</b> strokeWidth 1.7 e size 14 default · mesmo peso da tipografia.</li>
              <li><b style={{ color: 'var(--text)' }}>Tons via CSS vars:</b> 11 tons mapeados (brand, success, warning, alert, danger, purple, pink, soft, muted, text).</li>
              <li><b style={{ color: 'var(--text)' }}>Sizes semânticos:</b> xs(11) · sm(12) · md(14) · lg(16) · xl(20) · 2xl(24).</li>
              <li><b style={{ color: 'var(--text)' }}>aria-hidden por padrão:</b> só vira interativo quando recebe aria-label.</li>
            </ul>
          </div>
          <div
            className="mono overflow-x-auto rounded-[12px] border p-5 text-[12px] leading-[1.6]"
            style={{
              background: 'var(--surface-2)',
              borderColor: 'var(--line-1)',
              color: 'var(--text-soft)',
            }}
          >
            <div><span style={{ color: 'var(--success)' }}>import</span> {`{ Icon }`} <span style={{ color: 'var(--success)' }}>from</span> <span style={{ color: 'var(--brand)' }}>'@/components/atoms'</span></div>
            <div><span style={{ color: 'var(--success)' }}>import</span> {`{ Plus, Bell }`} <span style={{ color: 'var(--success)' }}>from</span> <span style={{ color: 'var(--brand)' }}>'lucide-react'</span></div>
            <div className="mt-3"><span style={{ color: 'var(--text-mute)' }}>// tamanho padrão · md (14px)</span></div>
            <div><span style={{ color: 'var(--brand)' }}>{`<Icon`}</span> icon={`{Plus}`} <span style={{ color: 'var(--brand)' }}>/{`>`}</span></div>
            <div className="mt-2"><span style={{ color: 'var(--text-mute)' }}>// com tone e size</span></div>
            <div><span style={{ color: 'var(--brand)' }}>{`<Icon`}</span> icon={`{Bell}`} size=<span style={{ color: 'var(--pink)' }}>"lg"</span> tone=<span style={{ color: 'var(--pink)' }}>"brand"</span> <span style={{ color: 'var(--brand)' }}>/{`>`}</span></div>
            <div className="mt-2"><span style={{ color: 'var(--text-mute)' }}>// botão de ação interativo</span></div>
            <div><span style={{ color: 'var(--brand)' }}>{`<Icon`}</span></div>
            <div className="pl-4">icon={`{X}`}</div>
            <div className="pl-4">size={`{11}`} strokeWidth={`{2.4}`}</div>
            <div className="pl-4">onClick={`{onClose}`}</div>
            <div className="pl-4">aria-label=<span style={{ color: 'var(--pink)' }}>"Fechar"</span></div>
            <div><span style={{ color: 'var(--brand)' }}>{`/>`}</span></div>
          </div>
        </div>
      </Showcase>

      <SubHead num="B" title="Tamanhos · 6 escalas semânticas" italic="11 · 12 · 14 · 16 · 20 · 24 px" />
      <Showcase>
        <div className="grid grid-cols-6 gap-3 max-[760px]:grid-cols-3">
          {sizesOrder.map((s) => (
            <div
              key={s}
              className="flex flex-col items-center gap-2 rounded-[10px] border p-4"
              style={{ background: 'var(--surface-1)', borderColor: 'var(--line-1)' }}
            >
              <Icon icon={Plus} size={s} />
              <div className="mono text-[10px] font-semibold uppercase tracking-[1.2px]" style={{ color: 'var(--text-mute)' }}>
                {s} · {iconSize[s]}px
              </div>
            </div>
          ))}
        </div>
      </Showcase>

      <SubHead num="C" title="Tons · 11 semânticos via CSS vars" />
      <Showcase>
        <div className="grid grid-cols-6 gap-3 max-[760px]:grid-cols-3">
          {tonesOrder.map((t) => (
            <div
              key={t}
              className="flex flex-col items-center gap-2 rounded-[10px] border p-4"
              style={{ background: 'var(--surface-1)', borderColor: 'var(--line-1)' }}
            >
              <Icon icon={Bell} size="xl" tone={t} />
              <div className="mono text-[10px] font-semibold uppercase tracking-[1.2px]" style={{ color: 'var(--text-mute)' }}>
                {t}
              </div>
            </div>
          ))}
        </div>
      </Showcase>

      <SubHead num="D" title="Peso do traço" italic="1.7 é o default editorial" />
      <Showcase>
        <div className="flex items-center justify-center gap-12">
          {strokeWeights.map((sw) => (
            <div key={sw} className="flex flex-col items-center gap-3">
              <Icon icon={Star} size="2xl" strokeWidth={sw} tone="brand" />
              <div className="mono text-[10px] font-semibold uppercase tracking-[1.2px]" style={{ color: 'var(--text-mute)' }}>
                stroke {sw}
                {sw === 1.7 && (
                  <span className="ml-2 inline-block rounded-full px-1.5 py-0.5 text-[8px]" style={{ background: 'var(--brand)', color: 'var(--bg)' }}>
                    DEFAULT
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Showcase>

      <SubHead num="E" title="Biblioteca curada" italic={`${totalIcons} ícones · busque por nome ou significado`} />
      <Showcase>
        {/* Busca + filtro por categoria */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Input
            icon={<Search size={14} />}
            placeholder="Buscar ícone · ex: editar, sucesso, obra, mapa…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-md"
          />
          <span
            className="mono text-[10.5px] font-semibold uppercase tracking-[1.2px]"
            style={{ color: 'var(--text-mute)' }}
          >
            {visibleCount} de {totalIcons}
          </span>
        </div>

        {/* Chips de categoria */}
        <div className="mb-5 flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveGroup('all')}
            className="cursor-pointer rounded-[8px] border px-3 py-1.5 text-[11.5px] font-semibold transition-colors"
            style={{
              background: activeGroup === 'all' ? 'var(--brand)' : 'transparent',
              color: activeGroup === 'all' ? 'var(--bg)' : 'var(--text-soft)',
              borderColor: activeGroup === 'all' ? 'var(--brand)' : 'var(--line-2)',
            }}
          >
            Todas · {totalIcons}
          </button>
          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGroup(g.id)}
              className="cursor-pointer rounded-[8px] border px-3 py-1.5 text-[11.5px] font-semibold transition-colors"
              style={{
                background: activeGroup === g.id ? 'var(--brand)' : 'transparent',
                color: activeGroup === g.id ? 'var(--bg)' : 'var(--text-soft)',
                borderColor: activeGroup === g.id ? 'var(--brand)' : 'var(--line-2)',
              }}
            >
              {g.label} · {g.icons.length}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          {filteredGroups.length === 0 && (
            <div
              className="rounded-[10px] border p-6 text-center text-[13px]"
              style={{
                background: 'var(--surface-2)',
                borderColor: 'var(--line-1)',
                color: 'var(--text-mute)',
              }}
            >
              Nenhum ícone encontrado para <code className="mono" style={{ color: 'var(--text)' }}>"{query}"</code>.
            </div>
          )}
          {filteredGroups.map((g) => (
            <div key={g.id}>
              <div className="mb-2 flex items-baseline justify-between">
                <h4
                  className="serif text-[18px] font-normal"
                  style={{ color: 'var(--text)', letterSpacing: '-0.015em' }}
                >
                  {g.label}{' '}
                  <em className="italic font-normal" style={{ color: 'var(--text-soft)' }}>
                    · {g.italic}
                  </em>
                </h4>
                <span
                  className="mono text-[10.5px] font-semibold"
                  style={{ color: 'var(--text-mute)' }}
                >
                  {g.icons.length}
                </span>
              </div>
              <p className="mb-3 text-[12.5px]" style={{ color: 'var(--text-soft)' }}>
                {g.description}
              </p>
              <div
                className="grid gap-2"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}
              >
                {g.icons.map((entry) => (
                  <div
                    key={`${g.id}-${entry.lucide}`}
                    className="group grid grid-cols-[36px_1fr] items-center gap-3 rounded-[8px] border p-3 transition-all hover:border-[var(--line-3)] hover:bg-[var(--surface-2)]"
                    style={{ background: 'var(--surface-1)', borderColor: 'var(--line-1)' }}
                  >
                    <span
                      className="inline-flex h-9 w-9 items-center justify-center rounded-[8px]"
                      style={{ background: 'var(--surface-2)', color: 'var(--text)' }}
                    >
                      <Icon icon={entry.icon} size="lg" />
                    </span>
                    <div className="min-w-0">
                      <div
                        className="mono truncate text-[11.5px] font-semibold"
                        style={{ color: 'var(--text)' }}
                      >
                        {entry.lucide}
                      </div>
                      <div
                        className="truncate text-[11px] leading-tight"
                        style={{ color: 'var(--text-mute)' }}
                        title={entry.semantic}
                      >
                        {entry.semantic}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Showcase>

      <SubHead num="F" title="Princípios de uso" italic="o que fazer e não fazer" />
      <Showcase>
        <div className="grid grid-cols-2 gap-4 max-[760px]:grid-cols-1">
          <div
            className="rounded-[10px] border p-4"
            style={{ background: 'rgba(95,217,165,0.06)', borderColor: 'rgba(95,217,165,0.32)' }}
          >
            <div className="mb-2 flex items-center gap-2">
              <Icon icon={Check} size="md" tone="success" strokeWidth={2.2} />
              <span
                className="mono text-[10.5px] font-semibold uppercase tracking-[1.4px]"
                style={{ color: 'var(--success)' }}
              >
                Faça
              </span>
            </div>
            <ul className="flex flex-col gap-1.5 text-[12.5px]" style={{ color: 'var(--text-soft)' }}>
              <li>Use lucide-react para todos os ícones · NUNCA SVG inline custom.</li>
              <li>Stroke 1.7 default · 2.2 quando precisar de mais ênfase (botão de close).</li>
              <li>Paireie cor semântica com significado (success + Check, danger + X).</li>
              <li>Tamanho coerente com o texto (md para 13-14px · lg para 16-18px).</li>
              <li>Adicione aria-label quando o ícone for o ÚNICO conteúdo do botão.</li>
              <li>Reactions com lucide (ThumbsUp, Heart) — nunca emoji nativo.</li>
            </ul>
          </div>
          <div
            className="rounded-[10px] border p-4"
            style={{ background: 'rgba(235,87,87,0.06)', borderColor: 'rgba(235,87,87,0.32)' }}
          >
            <div className="mb-2 flex items-center gap-2">
              <Icon icon={X} size="md" tone="danger" strokeWidth={2.4} />
              <span
                className="mono text-[10.5px] font-semibold uppercase tracking-[1.4px]"
                style={{ color: 'var(--danger)' }}
              >
                Não faça
              </span>
            </div>
            <ul className="flex flex-col gap-1.5 text-[12.5px]" style={{ color: 'var(--text-soft)' }}>
              <li>Misturar packs · só lucide-react no DS (sem heroicons, feather, font awesome).</li>
              <li>Tamanhos arbitrários sem necessidade · prefira os 6 sizes semânticos.</li>
              <li>Ícone decorativo SEM aria-hidden em contexto crítico (a11y).</li>
              <li>Color hardcoded · use tone='brand' não color: '#74C7E4'.</li>
              <li>Emoji nativo no produto · usar lucide para consistência cross-platform.</li>
              <li>Ícones com label conflitante (Heart vermelho em "favoritar" passa "danger").</li>
            </ul>
          </div>
        </div>
      </Showcase>
    </div>
  )
}
