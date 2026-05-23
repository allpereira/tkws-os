import { useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { AILumen, type LumenMessage } from '@/components/tkws/ai-lumen'
import type { AIPrompt } from '@/lib/prompts'

const initial: LumenMessage[] = [
  {
    id: '1',
    role: 'user',
    body: 'Resuma os atrasos da semana e o impacto financeiro',
  },
  {
    id: '2',
    role: 'assistant',
    body: (
      <div>
        <p>Resumo dos atrasos · semana de 13-19/mai:</p>
        <ul className="mt-2 list-disc space-y-1 pl-4">
          <li><b>Yachthouse 2104</b> · 8 dias atraso · granito São Gabriel · impacto: R$ 124k em mão de obra ociosa.</li>
          <li><b>Vitra 1801</b> · 3 dias atraso · cliente segurando aprovação do moodboard · impacto: zero financeiro, mas bloqueia próxima etapa.</li>
        </ul>
        <p className="mt-3">
          <b>Sugestão:</b> contatar fornecedor SG com nova cotação (Marmoraria Itajaí tem alternativa 18% mais barata).
        </p>
      </div>
    ),
  },
]

const prompt: AIPrompt = {
  componente: 'AI · Lúmen',
  import: "import { AILumen, type LumenMessage } from '@/components/tkws/ai-lumen'",
  contexto:
    'Assistente do TKWS OS · diferente de Chat genérico. Suporta streaming (typing dot), thinking state (analisando…), sugestões iniciais, feedback inline (thumbs up/down), regenerar resposta. Backend deve usar Claude API com streaming SSE + tool use.',
  quandoUsar: [
    'Briefing inteligente · gerar primeira versão automaticamente',
    'Análise de portfólio · resumo executivo',
    'Sugestão de cotação inicial · estimativa por m²',
    'Q&A sobre dados do projeto',
  ],
  props: [
    { name: 'messages', type: 'LumenMessage[]', description: '{ role: user|assistant|thinking, body, streaming? }' },
    { name: 'onSend', type: '(text) => void', description: 'Dispara mutation com streaming SSE' },
    { name: 'onStop', type: '() => void', description: 'Abort do stream em andamento' },
    { name: 'onRegenerate / onFeedback', type: 'callbacks', description: 'Para iteração e analytics' },
    { name: 'suggestions', type: 'string[]', description: 'Sugestões iniciais · default 3' },
    { name: 'isGenerating', type: 'boolean', description: 'Mostra "Pensando…" e bloqueia input' },
  ],
  antiPatterns: [
    'Resposta sem streaming · UX trava em geração longa',
    'Sem botão Parar durante geração',
    'Sem feedback (thumbs) · perde sinal de qualidade',
    'Lúmen respondendo sem contexto do projeto atual · respostas genéricas',
  ],
  exemplo: `const { mutate, isPending } = useChatMutation()

<AILumen
  messages={messages}
  isGenerating={isPending}
  onSend={(text) => mutate({ context: projectId, prompt: text })}
  onStop={abortStream}
  onRegenerate={() => mutate({ retry: true })}
  onFeedback={(id, kind) => track('lumen.feedback', { id, kind })}
/>`,
  relacionados: ['Chat', 'Claude API', 'Streaming SSE'],
}

export function AILumenPage() {
  const [messages, setMessages] = useState<LumenMessage[]>(initial)
  const [isGenerating, setGen] = useState(false)

  function handleSend(text: string) {
    setMessages((m) => [...m, { id: String(Date.now()), role: 'user', body: text }])
    setGen(true)
    setMessages((m) => [...m, { id: 'thinking', role: 'thinking', body: '' }])

    setTimeout(() => {
      setMessages((m) => [
        ...m.filter((x) => x.id !== 'thinking'),
        {
          id: String(Date.now() + 1),
          role: 'assistant',
          body: 'Resposta simulada · em produção, isto seria streaming via SSE da Claude API com tool use para consultar o portfólio do escritório.',
        },
      ])
      setGen(false)
    }, 1500)
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="14.2"
        category="Collab · AI Lúmen"
        title="AI · Lúmen"
        italic="assistente TKWS"
        description="Assistente com streaming, thinking state, feedback inline. Backend: Claude API com SSE + tool use."
        tag="agente do TKWS OS"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Conversa com contexto do projeto" />
      <Showcase padding="none">
        <AILumen
          messages={messages}
          isGenerating={isGenerating}
          onSend={handleSend}
          onStop={() => {
            setGen(false)
            setMessages((m) => m.filter((x) => x.id !== 'thinking'))
            toast.info('Geração cancelada')
          }}
          onRegenerate={() => toast.info('Regenerando resposta…')}
          onFeedback={(_, kind) =>
            toast.success(kind === 'up' ? 'Marcado como útil · obrigado!' : 'Feedback registrado · vamos melhorar')
          }
        />
      </Showcase>

      <SubHead num="B" title="Empty state · sem histórico ainda" />
      <Showcase padding="none">
        <AILumen
          messages={[]}
          onSend={(t) => toast.success(`Enviado: ${t}`)}
          suggestions={[
            'Resuma os atrasos da semana',
            'Quais projetos têm margem abaixo do alvo?',
            'Gere uma cotação inicial para 280m² premium',
            'Analise a curva de fornecedores deste mês',
          ]}
        />
      </Showcase>
    </div>
  )
}
