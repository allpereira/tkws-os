import * as React from 'react'
import { Send, Paperclip, Smile } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export interface ChatMessage {
  id: string
  authorInitials: string
  authorName: string
  side: 'me' | 'them'
  body: React.ReactNode
  meta?: string
  /** url(s) ou nomes de attachments */
  attachments?: { name: string; url?: string }[]
  /** opcional · cor de fundo do avatar */
  avatarColor?: string
}

export interface ChatProps {
  messages: ChatMessage[]
  onSend?: (text: string) => void
  /** placeholder do input */
  placeholder?: string
  className?: string
  /** Altura do canvas · default h-96 */
  height?: string
}

export function Chat({ messages, onSend, placeholder = 'Mensagem para o squad…', className, height = 'h-96' }: ChatProps) {
  const [draft, setDraft] = React.useState('')
  const endRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  function handleSend() {
    const text = draft.trim()
    if (!text) return
    onSend?.(text)
    setDraft('')
  }

  return (
    <div
      className={cn('flex flex-col overflow-hidden rounded-xl border', className)}
      style={{ background: 'var(--surface-1)', borderColor: 'var(--line-1)' }}
    >
      <div className={cn('overflow-y-auto p-4', height)}>
        <div className="flex flex-col gap-3">
          {messages.map((m) => (
            <Message key={m.id} message={m} />
          ))}
          <div ref={endRef} />
        </div>
      </div>

      <div
        className="grid grid-cols-[auto_1fr_auto] items-end gap-2 border-t p-3"
        style={{ borderColor: 'var(--line-1)', background: 'var(--surface-2)' }}
      >
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" aria-label="Anexar">
            <Paperclip size={14} strokeWidth={1.7} />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Emoji">
            <Smile size={14} strokeWidth={1.7} />
          </Button>
        </div>
        <Textarea
          rows={1}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder={placeholder}
          className="min-h-9 resize-none py-1.5"
        />
        <Button onClick={handleSend} disabled={!draft.trim()} aria-label="Enviar">
          <Send size={14} strokeWidth={1.7} />
        </Button>
      </div>
    </div>
  )
}

function Message({ message }: { message: ChatMessage }) {
  const isMe = message.side === 'me'
  return (
    <div className={cn('flex items-end gap-2.5', isMe && 'flex-row-reverse')}>
      <Avatar size="sm" style={{ background: message.avatarColor ?? (isMe ? 'var(--brand)' : 'var(--purple)') }}>
        <AvatarFallback>{message.authorInitials}</AvatarFallback>
      </Avatar>
      <div className={cn('flex max-w-[78%] flex-col gap-1', isMe && 'items-end')}>
        <div
          className="mono inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[1.4px]"
          style={{ color: 'var(--text-mute)' }}
        >
          {message.authorName}
          {message.meta && <span>· {message.meta}</span>}
        </div>
        <div
          className="rounded-2xl px-3 py-2 text-[13px] leading-relaxed"
          style={{
            background: isMe ? 'var(--brand-soft)' : 'var(--surface-2)',
            color: 'var(--text)',
            border: isMe ? '1px solid var(--brand)' : '1px solid var(--line-1)',
            borderTopRightRadius: isMe ? 4 : undefined,
            borderTopLeftRadius: !isMe ? 4 : undefined,
          }}
        >
          {message.body}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {message.attachments.map((a, i) => (
                <span
                  key={i}
                  className="mono inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold"
                  style={{ background: 'var(--surface-1)', borderColor: 'var(--line-2)', color: 'var(--text-soft)' }}
                >
                  <Paperclip size={9} /> {a.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
