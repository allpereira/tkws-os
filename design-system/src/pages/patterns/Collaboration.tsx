import { useState } from 'react'
import { AtSign, Check, MessageSquare, ThumbsUp } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarGroup } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Chat, type ChatMessage } from '@/components/tkws/chat'
import { Timeline, type TimelineItem } from '@/components/tkws/timeline'
import { NotificationBell, type NotificationItem } from '@/components/tkws/notification-bell'
import type { AIPrompt } from '@/lib/prompts'

const comments: TimelineItem[] = [
  {
    id: '1',
    meta: 'LUCAS Z. · há 12 min',
    title: <><span>@</span>ana, podemos antecipar o granito?</>,
    description: 'O cliente confirmou que tudo bem usar a alternativa que você sugeriu. Vamos cotar com a SG já?',
    tone: 'brand',
  },
  {
    id: '2',
    meta: 'ANA V. · há 8 min',
    title: <>Boa, Lucas. Vou pedir cotação agora.</>,
    description: <>Já mandei mensagem pro <b style={{ color: 'var(--brand)' }}>@allysson</b> também. Quartzito Imperial 18 m² · prazo 12 dias.</>,
    tone: 'success',
  },
  {
    id: '3',
    meta: 'ALLYSSON · agora',
    title: <>Top. Tô confirmando com a obra que cabe.</>,
    tone: 'neutral',
  },
]

const chatMessages: ChatMessage[] = [
  {
    id: '1',
    side: 'them',
    authorInitials: 'LZ',
    authorName: 'Lucas Z.',
    meta: '11:42',
    body: 'Acabei de subir o render da cozinha · pode dar uma olhada?',
    avatarColor: 'var(--brand)',
  },
  {
    id: '2',
    side: 'me',
    authorInitials: 'AP',
    authorName: 'Você',
    meta: '11:44',
    body: 'Top! Vou abrir agora.',
  },
]

const prompt: AIPrompt = {
  componente: 'Pattern · Colaboração',
  import: '// Composição: Chat + Comments + @Mentions + Presence + Reactions',
  contexto:
    'Padrões de colaboração TKWS · chat sincrono (tempo real), comments assíncronos (em item), @mentions tipadas com Combobox · presence indicators · reactions (👍 só ícones do lucide, sem emoji). Use TanStack Query + WebSocket via Pusher/Ably para presence.',
  quandoUsar: [
    'Comments em projeto, briefing, orçamento (assíncrono)',
    'Chat de squad / cliente (sincrono)',
    '@mentions em qualquer textarea via Combobox',
  ],
  props: [],
  antiPatterns: [
    'Emoji nativos como reactions · use ícones lucide',
    'Sem indicador de "alguém está digitando"',
    'Comments sem permalink · não dá para compartilhar',
  ],
  exemplo: `// Comments em Card
<CommentList postId={projectId} />

// @mentions com Combobox dentro de Textarea
// detecta '@' e abre popover com lista de membros

// Presence
<AvatarGroup>
  {onlineMembers.map(...)}
</AvatarGroup>`,
  relacionados: ['Chat', 'Timeline', 'Combobox'],
}

const notificationItems: NotificationItem[] = [
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

export function CollaborationPattern() {
  const [draft, setDraft] = useState('')
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        num="P14"
        category="Pattern · Colaboração"
        title="Colaboração"
        italic="chat · comments · @mentions · presence"
        description="Padrões de comunicação síncrona e assíncrona TKWS. Realtime via WebSocket; comments via TanStack Query."
        tag="comms"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Notification Bell · dot + count + popover com tabs" />
      <Showcase>
        <div className="flex flex-wrap items-start gap-10">
          <div className="flex items-center gap-3">
            <NotificationBell items={[]} unreadCount={0} />
            <NotificationBell items={notificationItems} dotOnly />
            <NotificationBell items={notificationItems} unreadCount={12} />
          </div>
          <div className="text-[12px]" style={{ color: 'var(--text-mute)' }}>
            <p style={{ maxWidth: 320, lineHeight: 1.55 }}>
              Clique no terceiro sino para ver o popover completo · com tabs (Tudo · Menções · Atribuídas), agrupamento por data, items unread destacados e footer com links.
            </p>
          </div>
        </div>
      </Showcase>

      <SubHead num="B" title="Presence · time online agora" />
      <Showcase>
        <Card>
          <CardHeader>
            <CardTitle>Squad Orion · online agora</CardTitle>
            <Badge tone="success" pulse>4 online</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <AvatarGroup>
                <Avatar style={{ background: 'var(--brand)' }}><AvatarFallback>LZ</AvatarFallback></Avatar>
                <Avatar style={{ background: 'var(--purple)' }}><AvatarFallback>AV</AvatarFallback></Avatar>
                <Avatar style={{ background: 'var(--success)' }}><AvatarFallback>JQ</AvatarFallback></Avatar>
                <Avatar style={{ background: 'var(--warning)', color: 'var(--bg)' }}><AvatarFallback>RL</AvatarFallback></Avatar>
              </AvatarGroup>
              <div className="text-[12.5px]" style={{ color: 'var(--text-soft)' }}>
                <b style={{ color: 'var(--text)' }}>Lucas Z.</b> está editando o briefing · <b style={{ color: 'var(--text)' }}>Ana V.</b> está cotando o granito
              </div>
            </div>
          </CardContent>
        </Card>
      </Showcase>

      <SubHead num="C" title="Comments · thread em projeto · com @mentions" />
      <Showcase>
        <Card>
          <CardHeader>
            <CardTitle>Comentários · #2410 Yachthouse · 3</CardTitle>
            <Badge tone="brand"><MessageSquare size={11} /> ativo</Badge>
          </CardHeader>
          <CardContent>
            <Timeline items={comments} />

            {/* Composer */}
            <div className="mt-5 grid gap-2 rounded-xl border p-3" style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)' }}>
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={2}
                placeholder='Use @ para mencionar alguém do squad…'
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  <Button variant="ghost" size="sm"><AtSign size={12} /> Mencionar</Button>
                  <Button variant="ghost" size="sm"><ThumbsUp size={12} /> Reagir</Button>
                </div>
                <Button size="sm" disabled={!draft.trim()}>Comentar</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Showcase>

      <SubHead num="D" title="Chat síncrono · squad ↔ líder" />
      <Showcase padding="none">
        <Chat messages={chatMessages} />
      </Showcase>

      <SubHead num="E" title="Reactions · ícones lucide" />
      <Showcase>
        <div className="flex flex-wrap gap-2">
          {[
            { ic: <ThumbsUp size={11} />, count: 12 },
            { ic: <MessageSquare size={11} />, count: 4 },
            { ic: <AtSign size={11} />, count: 2 },
          ].map((r, i) => (
            <button
              key={i}
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors hover:brightness-110"
              style={{ background: 'var(--surface-2)', borderColor: 'var(--line-2)', color: 'var(--text-soft)' }}
            >
              {r.ic}
              <span className="mono font-bold">{r.count}</span>
            </button>
          ))}
        </div>
      </Showcase>
    </div>
  )
}
