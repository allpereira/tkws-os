import { Check } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { NotificationBell, type NotificationItem } from '@/components/tkws/notification-bell'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'NotificationBell',
  import: "import { NotificationBell } from '@/components/tkws/notification-bell'",
  contexto:
    'Sino do topbar com popover de notificações · 3 tabs (Tudo, Menções, Atribuídas) · agrupamento por data · items unread destacados em brand-soft 4% · footer com links. Para Realtime use WebSocket (Pusher/Ably) atualizando o array.',
  quandoUsar: [
    'Topbar do app · acessado por ⌘B',
    'Header de portal externo (cliente, parceiro)',
    'Sidebar de notificações expansível',
  ],
  props: [
    { name: 'items', type: 'NotificationItem[]', description: 'Lista com group/avatar/body/preview/ts/unread' },
    { name: 'unreadCount', type: 'number', description: 'Mostra count-badge' },
    { name: 'dotOnly', type: 'boolean', description: 'Mostra apenas o dot (sem número)' },
    { name: 'onMarkAllRead', type: '() => void', description: 'Click em "Marcar tudo como lido"' },
    { name: 'onSelect', type: '(id) => void', description: 'Click em uma notificação' },
  ],
  antiPatterns: [
    'Sem grupos por data · vira lista infinita',
    'Avatar sem cor por persona · perde identificação rápida',
    'Sem markAllRead · usuário fica preso em 99+',
  ],
  exemplo: `<NotificationBell
  items={items}
  unreadCount={3}
  onMarkAllRead={() => api.notifications.markAllRead()}
  onSelect={(id) => navigate(\`/notifications/\${id}\`)}
/>`,
  relacionados: ['Popover', 'Avatar', 'Badge'],
}

const sample: NotificationItem[] = [
  {
    id: '1',
    avatar: 'LZ',
    avatarBg: 'var(--purple)',
    body: (
      <>
        <b>Loiana Zoboli</b> mencionou você em <b>Yachthouse 2104</b>
      </>
    ),
    preview: '"@allysson conseguimos confirmar nova entrega para 22/05…"',
    ts: '14:22',
    unread: true,
    group: 'Hoje',
  },
  {
    id: '2',
    avatar: <Check size={14} strokeWidth={2.2} />,
    avatarSystem: true,
    body: (
      <>
        Orçamento <b>v3</b> aprovado pela <b>Família Andrade</b>
      </>
    ),
    preview: 'R$ 2,4M · pronto para iniciar obra',
    ts: '12:48',
    unread: true,
    group: 'Hoje',
  },
  {
    id: '3',
    avatar: 'AV',
    avatarBg: 'var(--warning)',
    body: (
      <>
        <b>Ana Vilas Boas</b> atribuiu você ao projeto <b>Palazzo Lumini</b>
      </>
    ),
    ts: '11:10',
    unread: true,
    group: 'Hoje',
  },
  {
    id: '4',
    avatar: 'RL',
    avatarBg: 'var(--purple)',
    body: (
      <>
        <b>Rafael L.</b> respondeu seu comentário em <b>Cob. Titanium</b>
      </>
    ),
    ts: 'ontem · 18:30',
    group: 'Ontem',
  },
  {
    id: '5',
    avatar: <Check size={14} strokeWidth={2.2} />,
    avatarSystem: true,
    body: 'Sincronização do catálogo concluída',
    preview: '17 fornecedores atualizados · 3 cotações novas',
    ts: 'ontem · 09:22',
    group: 'Ontem',
  },
]

export function NotificationBellPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="11.10"
        category="TKWS · NotificationBell"
        title="NotificationBell"
        italic="dot · count · popover"
        description="Sino do topbar com popover · tabs · grupos por data · items unread destacados."
        tag="3 variantes"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="3 estados · sem notif · dot · count badge" />
      <Showcase>
        <div className="flex items-center gap-4">
          <NotificationBell items={[]} unreadCount={0} />
          <NotificationBell items={sample} dotOnly />
          <NotificationBell items={sample} unreadCount={12} />
        </div>
      </Showcase>

      <SubHead num="B" title="Popover completo · clique para abrir" />
      <Showcase>
        <div className="flex items-start gap-4">
          <NotificationBell items={sample} unreadCount={3} />
          <p className="max-w-[420px] text-[12.5px]" style={{ color: 'var(--text-soft)', lineHeight: 1.55 }}>
            Click no sino · veja tabs (Tudo · Menções · Atribuídas), agrupamento por data, items unread destacados em brand-soft, avatar do tipo system (ícone) com border brand · footer com "Ver todas" e "Preferências".
          </p>
        </div>
      </Showcase>
    </div>
  )
}
