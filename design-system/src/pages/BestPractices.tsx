import { CheckCircle2, XCircle } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { SubHead, Showcase } from '@/components/docs/Showcase'

const dos = [
  'Schema Zod primeiro · forma dos dados antes da UI',
  'react-hook-form + zodResolver sempre · sem exceção',
  'TanStack Query para data fetching · nada de useEffect',
  'lucide-react ícones · strokeWidth 1.5 · 16-20px',
  'CSS variables · text-brand, bg-surface-2 · nunca hex inline',
  'Intl.NumberFormat para moeda · date-fns com pt-BR para datas',
  'Listas 50+ itens · virtualize com @tanstack/virtual',
  'prefers-reduced-motion respeitado em todas animações',
]

const donts = [
  'fetch direto fora de TanStack Query',
  'useEffect para sync de dados de API',
  'any no TypeScript · use unknown + narrow',
  'Hardcode de "R$", "%", datas formatadas à mão',
  'Emoji como ícone funcional',
  'Cor nova fora do design token',
  'Dialog customizado sem Radix · acessibilidade quebra',
  'Botão primário roxo · paleta TKWS é navy + cyan',
]

const masterScreens = [
  { name: 'List screen', when: 'Índice de registros (Projetos, Clientes, Fornecedores). Sempre com view switcher Kanban/Lista/Tabela.' },
  { name: 'Detail screen', when: 'Um registro com múltiplas abas. Hero no topo, tabs abaixo.' },
  { name: 'Wizard', when: 'Criação ou configuração em múltiplas etapas. Stepper visível.' },
  { name: 'Drawer', when: 'Edição rápida sem perder contexto da tela anterior.' },
  { name: 'Settings', when: 'Configuração com sidebar nav à esquerda + seções no conteúdo.' },
  { name: 'Dashboard', when: 'KPIs + charts. Não é CRUD — é leitura.' },
]

const formPatterns = [
  { name: 'Quick-create modal', when: '≤ 3 campos. Detalhes ficam para depois.' },
  { name: 'Sectioned com TOC', when: 'Forms longos (15+ campos). Sticky TOC à esquerda.' },
  { name: 'Wizard', when: 'Processo com decisões dependentes entre etapas.' },
  { name: 'Drawer com form', when: 'Edição inline sem sair da listagem.' },
  { name: 'Conditional fields', when: 'Quando um campo abre sub-seções dependentes.' },
]

export function BestPracticesPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="14"
        category="Boas práticas"
        title="Construindo telas."
        italic="O caminho curto."
        description="Antes de uma única linha de código, identifique o padrão de tela e o padrão de form. Use o que existe, não invente. Anti-patterns são linhas vermelhas — se a tarefa implicar um deles, avise antes."
        tag="DoD + decision trees"
      />

      <SubHead num="14.1" title="Padrões de tela-mãe" italic="escolha uma antes de codar" />
      <div className="grid gap-px overflow-hidden rounded-2xl" style={{ background: 'var(--line-1)' }}>
        {masterScreens.map((s) => (
          <div
            key={s.name}
            className="grid grid-cols-[200px_1fr] gap-5 p-5"
            style={{ background: 'var(--surface-1)' }}
          >
            <div>
              <div className="serif text-[18px] font-normal tracking-tight" style={{ color: 'var(--text)' }}>
                {s.name}
              </div>
            </div>
            <div className="text-[13.5px] leading-relaxed" style={{ color: 'var(--text-soft)' }}>
              {s.when}
            </div>
          </div>
        ))}
      </div>

      <SubHead num="14.2" title="Padrões de formulário" italic="escolha pelo tamanho e dependência" />
      <div className="grid gap-px overflow-hidden rounded-2xl" style={{ background: 'var(--line-1)' }}>
        {formPatterns.map((f) => (
          <div
            key={f.name}
            className="grid grid-cols-[200px_1fr] gap-5 p-5"
            style={{ background: 'var(--surface-1)' }}
          >
            <div>
              <div className="serif text-[18px] font-normal tracking-tight" style={{ color: 'var(--text)' }}>
                {f.name}
              </div>
            </div>
            <div className="text-[13.5px] leading-relaxed" style={{ color: 'var(--text-soft)' }}>
              {f.when}
            </div>
          </div>
        ))}
      </div>

      <SubHead num="14.3" title="Definition of Done" italic="o que checar antes do PR" />
      <div className="grid grid-cols-2 gap-5 max-[760px]:grid-cols-1">
        <Showcase title="✓ Faça sempre" bg="surface-1">
          <ul className="space-y-2.5 text-[13px]">
            {dos.map((d) => (
              <li
                key={d}
                className="grid grid-cols-[16px_1fr] items-start gap-2 leading-relaxed"
                style={{ color: 'var(--text-soft)' }}
              >
                <CheckCircle2 size={13} style={{ color: 'var(--success)' }} />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </Showcase>
        <Showcase title="✗ Nunca faça" bg="surface-1">
          <ul className="space-y-2.5 text-[13px]">
            {donts.map((d) => (
              <li
                key={d}
                className="grid grid-cols-[16px_1fr] items-start gap-2 leading-relaxed"
                style={{ color: 'var(--text-soft)' }}
              >
                <XCircle size={13} style={{ color: 'var(--danger)' }} />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </Showcase>
      </div>
    </div>
  )
}
