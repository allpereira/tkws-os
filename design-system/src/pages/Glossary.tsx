import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { SubHead } from '@/components/docs/Showcase'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface Term {
  term: string
  category: 'Projeto' | 'Operação' | 'Financeiro' | 'AI' | 'UI' | 'Pessoas'
  short: string
  long?: string
}

const terms: Term[] = [
  // Projeto
  { term: 'Briefing', category: 'Projeto', short: 'Documento inicial · programa, restrições, referências', long: 'Editor rich text (Tiptap) com co-autoria. Vira contrato.' },
  { term: 'Spec', category: 'Projeto', short: 'Especificação técnica de cada item · marca, modelo, fornecedor' },
  { term: 'Orçamento', category: 'Projeto', short: 'Curva financeira do projeto por categoria · revisões versionadas' },
  { term: 'Punch list', category: 'Projeto', short: 'Lista de pendências/correções da obra · severidade baixa/média/alta' },
  { term: 'Moodboard', category: 'Projeto', short: 'Painel visual de referências · paleta, materiais, atmosfera' },
  { term: 'RT (Responsável Técnico)', category: 'Projeto', short: 'Arquiteto registrado no CREA · responsável pela obra' },
  { term: 'BIM', category: 'Projeto', short: 'Building Information Modeling · modelos 3D paramétricos' },

  // Operação
  { term: 'Squad', category: 'Operação', short: 'Time multidisciplinar dedicado a um conjunto de projetos · 3-7 pessoas' },
  { term: 'WIP limit', category: 'Operação', short: 'Work in progress · número máximo de cards permitidos por lane' },
  { term: 'Lane', category: 'Operação', short: 'Coluna do Kanban · representa um estado (Briefing, Em obra…)' },
  { term: 'Swimlane', category: 'Operação', short: 'Linha horizontal no Kanban Rich · agrupa por squad ou cliente' },
  { term: 'Saved view', category: 'Operação', short: 'Filtros + ordenação salvos na URL · compartilhável' },

  // Financeiro
  { term: 'Aging', category: 'Financeiro', short: 'Quanto tempo um recebível está em aberto · 0-30, 31-60, 61-90, +90 dias' },
  { term: 'Margem', category: 'Financeiro', short: 'Lucro / receita · medida em % · TKWS alvo: ≥ 30%' },
  { term: 'EBITDA', category: 'Financeiro', short: 'Earnings Before Interest, Taxes, Depreciation, Amortization' },
  { term: 'P&L', category: 'Financeiro', short: 'Profit & Loss · demonstrativo de resultado' },
  { term: 'NF', category: 'Financeiro', short: 'Nota fiscal · emitida pelo escritório ou fornecedor' },
  { term: 'Curva financeira', category: 'Financeiro', short: 'Distribuição do orçamento ao longo do tempo · cronograma de pagamento' },

  // AI
  { term: 'Lúmen', category: 'AI', short: 'Assistente AI do TKWS OS · usa Claude API + tool use com contexto do projeto' },
  { term: 'Streaming SSE', category: 'AI', short: 'Server-Sent Events · resposta da IA chega caractere a caractere' },
  { term: 'Tool use', category: 'AI', short: 'Capacidade da IA de chamar APIs do TKWS para responder (ex: getProject(2410))' },

  // UI
  { term: 'Densidade · Power', category: 'UI', short: 'Operação avançada · DataTables · keyboard-first · power-user' },
  { term: 'Densidade · Standard', category: 'UI', short: 'Operação balanceada · Kanban · clique e teclado' },
  { term: 'Densidade · Guided', category: 'UI', short: 'Cliente externo · cards grandes · linguagem natural · sem jargão' },
  { term: 'View switcher', category: 'UI', short: 'Tabs pill no topo · alterna entre Kanban/Lista/Tabela' },
  { term: 'Tela-mãe', category: 'UI', short: 'Padrão de tela reutilizado · List · Detail · Wizard · Drawer · Settings · Dashboard' },
  { term: 'Toast', category: 'UI', short: 'Notificação flutuante efêmera · sonner' },

  // Pessoas
  { term: 'Persona', category: 'Pessoas', short: 'Tipo de usuário do TKWS · 14 personas catalogadas (ver /personas)' },
  { term: 'Power-user', category: 'Pessoas', short: 'Usuário do squad com atalhos teclado · prefere densidade Power' },
  { term: 'Stakeholder', category: 'Pessoas', short: 'Cliente final + contratante PJ + investidor (todos externos)' },
]

const categories = ['Projeto', 'Operação', 'Financeiro', 'AI', 'UI', 'Pessoas'] as const

export function GlossaryPage() {
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    if (!q.trim()) return terms
    const needle = q.toLowerCase()
    return terms.filter(
      (t) => t.term.toLowerCase().includes(needle) || t.short.toLowerCase().includes(needle) || t.long?.toLowerCase().includes(needle)
    )
  }, [q])

  const grouped = categories.map((c) => ({ category: c, items: filtered.filter((t) => t.category === c) }))

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="P35"
        category="Documentação · Glossário"
        title="Glossário TKWS"
        italic="termos do produto"
        description="Linguagem comum do escritório. Use estes termos no UI · evite jargão técnico em portais externos."
        tag={`${terms.length} termos`}
      />

      <div className="mb-7 max-w-md">
        <Input
          icon={<Search size={14} />}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar termo (orçamento, kanban, lúmen…)"
        />
      </div>

      {grouped.map((g) => {
        if (g.items.length === 0) return null
        return (
          <section key={g.category}>
            <SubHead num={g.category.slice(0, 2).toUpperCase()} title={g.category} italic={`${g.items.length} termos`} />
            <div className="grid grid-cols-2 gap-3 max-[760px]:grid-cols-1">
              {g.items.map((t) => (
                <article
                  key={t.term}
                  className="rounded-xl border p-4"
                  style={{ background: 'var(--surface-1)', borderColor: 'var(--line-1)' }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="serif text-[18px] font-normal tracking-tight" style={{ color: 'var(--text)' }}>
                      {t.term}
                    </h3>
                    <Badge tone="neutral">{t.category}</Badge>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed" style={{ color: 'var(--text-soft)' }}>
                    {t.short}
                  </p>
                  {t.long && (
                    <p className="mt-2 text-[12px] leading-relaxed" style={{ color: 'var(--text-mute)' }}>
                      {t.long}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )
      })}

      {filtered.length === 0 && (
        <div className="rounded-xl border p-12 text-center" style={{ background: 'var(--surface-1)', borderColor: 'var(--line-1)' }}>
          <div className="mono text-[10.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
            Nada encontrado
          </div>
          <div className="serif mt-2 text-[20px] font-light" style={{ color: 'var(--text)' }}>
            Tente outro termo
          </div>
        </div>
      )}
    </div>
  )
}
