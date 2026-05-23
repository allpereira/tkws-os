import { useState } from 'react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Chat, type ChatMessage } from '@/components/tkws/chat'
import type { AIPrompt } from '@/lib/prompts'

const initial: ChatMessage[] = [
  {
    id: '1',
    side: 'them',
    authorInitials: 'LZ',
    authorName: 'Lucas Z. · Líder Squad Orion',
    meta: 'há 12 min',
    body: 'Time, encontrei uma alternativa pro granito São Gabriel. Custo 18% menor com prazo melhor.',
    avatarColor: 'var(--purple)',
  },
  {
    id: '2',
    side: 'me',
    authorInitials: 'AP',
    authorName: 'Você',
    meta: 'há 8 min',
    body: 'Boa! Pode mandar a ficha técnica?',
  },
  {
    id: '3',
    side: 'them',
    authorInitials: 'LZ',
    authorName: 'Lucas Z. · Líder Squad Orion',
    meta: 'há 5 min',
    body: 'Aqui · ele já forneceu pro projeto Vitra também.',
    attachments: [
      { name: 'granito-quartzito-imperial.pdf' },
      { name: 'cotacao-marmoraria-ws.xlsx' },
    ],
    avatarColor: 'var(--purple)',
  },
]

const prompt: AIPrompt = {
  componente: 'Chat',
  import: "import { Chat, type ChatMessage } from '@/components/tkws/chat'",
  contexto:
    'Container de chat com bolhas de mensagem, attachments, input com Enter to send. Diferente de Comments (assíncrono · por item): Chat é comunicação síncrona em tempo real (squad ↔ cliente, suporte).',
  quandoUsar: [
    'Comunicação interna · squad ↔ cliente',
    'Chat com cliente final · portal externo',
    'Threads de discussão sobre projeto/obra',
  ],
  props: [
    { name: 'messages', type: 'ChatMessage[]', description: 'Lista ordenada de mensagens · cada uma com side me/them' },
    { name: 'onSend', type: '(text: string) => void', description: 'Callback ao enviar · faz mutation' },
    { name: 'placeholder', type: 'string', description: 'Placeholder do input' },
    { name: 'height', type: 'string', description: 'Tailwind classe · default h-96' },
  ],
  antiPatterns: [
    'Chat sem indicador de presença (online/typing) em comunicação cliente · vire conf que algo mudou',
    'Chat sem auto-scroll ao final',
    'Persistir messages no Zustand · use TanStack Query com optimistic updates',
  ],
  exemplo: `const { data: messages } = useQuery({ queryKey: ['chat', threadId], queryFn })
const { mutate } = useMutation({ mutationFn: sendMessage })

<Chat
  messages={messages ?? []}
  onSend={(text) => mutate({ threadId, text })}
/>`,
  relacionados: ['Comments', 'Notifications'],
}

export function ChatPage() {
  const [messages, setMessages] = useState(initial)
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="14.1"
        category="Collab · Chat"
        title="Chat"
        italic="comunicação síncrona"
        description="Container de chat com bolhas, attachments e Enter to send. Use TanStack Query com optimistic updates."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Conversa squad ↔ líder" />
      <Showcase padding="none">
        <Chat
          messages={messages}
          onSend={(text) =>
            setMessages((m) => [
              ...m,
              {
                id: String(m.length + 1),
                side: 'me',
                authorInitials: 'AP',
                authorName: 'Você',
                meta: 'agora',
                body: text,
              },
            ])
          }
        />
      </Showcase>
    </div>
  )
}
