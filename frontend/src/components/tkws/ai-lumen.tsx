import * as React from 'react'
import { Send, Sparkles, Square, ThumbsDown, ThumbsUp, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

/**
 * AI · Lúmen · assistente do TKWS OS. Diferente do Chat genérico:
 *   • Suporta thinking/streaming (typing dot)
 *   • Sugestões de prompt iniciais
 *   • Feedback inline (thumbs up/down)
 *   • Tom editorial com brand gradient
 */

export type LumenRole = 'user' | 'assistant' | 'thinking'

export interface LumenMessage {
  id: string
  role: LumenRole
  body: React.ReactNode
  /** Loading state · usado com role='assistant' para streaming */
  streaming?: boolean
}

export interface AILumenProps {
  messages: LumenMessage[]
  onSend?: (text: string) => void
  onStop?: () => void
  onRegenerate?: () => void
  onFeedback?: (messageId: string, kind: 'up' | 'down') => void
  /** Sugestões iniciais para o usuário · clica e envia */
  suggestions?: string[]
  className?: string
  /** Está gerando resposta no momento */
  isGenerating?: boolean
  height?: string
}

export function AILumen({
  messages,
  onSend,
  onStop,
  onRegenerate,
  onFeedback,
  suggestions = [
    'Resuma os atrasos da semana',
    'Quais projetos têm margem abaixo do alvo?',
    'Gere uma cotação inicial para 280m² premium',
  ],
  className,
  isGenerating,
  height = 'h-[480px]',
}: AILumenProps) {
  const [draft, setDraft] = React.useState('')
  const endRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  function handleSend(text?: string) {
    const t = (text ?? draft).trim()
    if (!t) return
    onSend?.(t)
    setDraft('')
  }

  return (
    <div
      className={cn('flex flex-col overflow-hidden rounded-2xl border', className)}
      style={{
        background:
          'linear-gradient(180deg, rgba(116,199,228,0.04) 0%, var(--surface-1) 30%)',
        borderColor: 'var(--brand)',
      }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between border-b px-5 py-3.5"
        style={{ borderColor: 'var(--line-1)' }}
      >
        <div className="flex items-center gap-2.5">
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: 'var(--brand)', color: 'var(--bg)' }}
          >
            <Sparkles size={15} strokeWidth={1.7} />
          </span>
          <div>
            <div className="serif text-[15px] font-normal tracking-tight" style={{ color: 'var(--text)' }}>
              Lúmen <em className="italic" style={{ color: 'var(--brand)' }}>· AI</em>
            </div>
            <div className="mono text-[9.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
              {isGenerating ? 'Pensando…' : 'Pronto · contexto: projeto atual'}
            </div>
          </div>
        </div>
        {isGenerating && onStop && (
          <Button variant="outline" size="sm" onClick={onStop}>
            <Square size={11} /> Parar
          </Button>
        )}
      </header>

      {/* Messages */}
      <div className={cn('overflow-y-auto p-5', height)}>
        <div className="flex flex-col gap-4">
          {messages.map((m) => (
            <Message key={m.id} message={m} onFeedback={onFeedback} onRegenerate={onRegenerate} />
          ))}
          <div ref={endRef} />
        </div>

        {/* Sugestões · quando ainda não tem messages */}
        {messages.length === 0 && (
          <div className="grid gap-2">
            <div
              className="mono text-[10px] font-bold uppercase tracking-[1.4px]"
              style={{ color: 'var(--text-mute)' }}
            >
              Sugestões para começar
            </div>
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSend(s)}
                className="flex cursor-pointer items-start gap-2 rounded-lg border p-3 text-left text-[12.5px] transition-all hover:brightness-110"
                style={{
                  background: 'var(--surface-2)',
                  borderColor: 'var(--line-2)',
                  color: 'var(--text-soft)',
                }}
              >
                <Sparkles size={12} style={{ color: 'var(--brand)' }} className="mt-0.5 shrink-0" />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Composer */}
      <div
        className="grid grid-cols-[1fr_auto] items-end gap-2 border-t p-3"
        style={{ borderColor: 'var(--line-1)', background: 'var(--surface-2)' }}
      >
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
          placeholder="Pergunte ao Lúmen sobre projetos, dados, cotações…"
          className="min-h-9 resize-none py-1.5"
          disabled={isGenerating}
        />
        <Button onClick={() => handleSend()} disabled={!draft.trim() || isGenerating} aria-label="Enviar">
          <Send size={14} strokeWidth={1.7} />
        </Button>
      </div>
    </div>
  )
}

function Message({
  message,
  onFeedback,
  onRegenerate,
}: {
  message: LumenMessage
  onFeedback?: (id: string, kind: 'up' | 'down') => void
  onRegenerate?: () => void
}) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div
          className="max-w-[78%] rounded-2xl rounded-tr-md px-4 py-2.5 text-[13px] leading-relaxed"
          style={{ background: 'var(--brand-soft)', color: 'var(--text)', border: '1px solid var(--brand)' }}
        >
          {message.body}
        </div>
      </div>
    )
  }

  if (message.role === 'thinking') {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md" style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}>
          <Sparkles size={11} />
        </span>
        <div className="mono inline-flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: 'var(--text-mute)' }}>
          <ThinkingDots />
          Analisando dados do portfólio…
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[24px_1fr] gap-3">
      <span
        className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-md"
        style={{ background: 'var(--brand)', color: 'var(--bg)' }}
      >
        <Sparkles size={11} strokeWidth={1.8} />
      </span>
      <div>
        <div
          className="mono mb-1.5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[1.4px]"
          style={{ color: 'var(--text-mute)' }}
        >
          Lúmen
          {message.streaming && <Badge tone="brand" pulse>gerando</Badge>}
        </div>
        <div className="text-[13.5px] leading-relaxed" style={{ color: 'var(--text)' }}>
          {message.body}
          {message.streaming && (
            <span className="ml-0.5 inline-block h-3 w-1 animate-pulse align-middle" style={{ background: 'var(--brand)' }} />
          )}
        </div>
        {!message.streaming && (
          <div className="mt-2 flex items-center gap-1">
            <Button variant="ghost" size="icon" aria-label="Útil" onClick={() => onFeedback?.(message.id, 'up')}>
              <ThumbsUp size={12} />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Não útil" onClick={() => onFeedback?.(message.id, 'down')}>
              <ThumbsDown size={12} />
            </Button>
            {onRegenerate && (
              <Button variant="ghost" size="sm" onClick={onRegenerate}>
                <RotateCcw size={11} /> Regenerar
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-0.5">
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: 'currentColor', animation: 'alive-breathe 0.9s ease-in-out infinite' }} />
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: 'currentColor', animation: 'alive-breathe 0.9s ease-in-out infinite', animationDelay: '0.15s' }} />
      <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: 'currentColor', animation: 'alive-breathe 0.9s ease-in-out infinite', animationDelay: '0.3s' }} />
    </span>
  )
}
