import { Link } from '@tanstack/react-router'
import { Bot, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { navGroups } from '@/data/nav'

const SYSTEM_PROMPT = `# TKWS OS · Agent System Prompt

Você é um engenheiro frontend sênior construindo o TKWS OS — sistema operacional para
estúdios de arquitetura premium no Brasil. Você escreve código React 19 + TypeScript em
qualidade de produção, seguindo o design system TKWS com rigor.

## Stack obrigatório
React 19 + TypeScript (strict) + Vite
@tanstack/router · @tanstack/query · @tanstack/table · @tanstack/virtual
react-hook-form + zod (zodResolver)
shadcn/ui + @radix-ui/* + tailwindcss v4
motion (ex-framer-motion)
lucide-react · sonner · cmdk · recharts · date-fns

## Princípio que decide os casos cinzas
"Para arquitetos. Não para back-office."
Quando dividido entre densidade e clareza → clareza.
Quando dividido entre flexibilidade e foco → foco.
Quando dividido entre seguir o padrão e fazer algo diferente → siga o padrão.

## Antes de uma única linha
1. Identifique o padrão de tela (List · Detail · Wizard · Drawer · Settings · Dashboard)
2. Identifique o padrão de form (Quick · Sectioned com TOC · Wizard · Drawer · Conditional)
3. Componentes: use o catálogo, NÃO invente variante nova
4. Schema Zod primeiro · forma dos dados antes da UI
5. Convenções de código (typescript strict, sem any, sem hex inline, sem hardcode "R$")

## Anti-patterns · linhas vermelhas
- fetch direto fora de TanStack Query
- useEffect para sync de dados de API
- any no TS
- Hardcode de "R$", "%", datas formatadas à mão
- Emoji como ícone funcional
- Cor nova fora do design token
- Dialog customizado sem Radix
- Botão primário roxo (paleta TKWS é navy + cyan)`

export function AiPromptsIndexPage() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(SYSTEM_PROMPT)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const componentGroups = navGroups.filter((g) => g.tag === 'cmp' || g.tag === 'pat' || g.tag === 'data')

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="15"
        category="IA & Agentes"
        title="Prompts estruturados."
        italic="Pronto para colar."
        description="Cada componente do TKWS OS expõe um prompt estruturado em 5 seções: contexto, quando usar, props, anti-patterns e exemplo. O system prompt geral abaixo deve ser colado no agente uma vez; depois, use o prompt específico de cada componente conforme a tarefa."
        tag="cole no agente"
      />

      <Showcase
        title="System prompt geral · cole UMA vez no agente"
        description="Filosofia + stack + princípios + anti-patterns. Versão completa em architeture/AGENT.md."
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: 'var(--brand)', color: 'var(--bg)' }}
            >
              <Bot size={20} strokeWidth={1.7} />
            </span>
            <div>
              <div
                className="mono text-[10px] font-bold uppercase tracking-[1.6px]"
                style={{ color: 'var(--brand)' }}
              >
                System prompt · TKWS OS
              </div>
              <div className="serif text-[18px] font-normal tracking-tight" style={{ color: 'var(--text)' }}>
                Engenheiro frontend sênior · React 19 + shadcn
              </div>
            </div>
          </div>
          <button
            onClick={copy}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-semibold transition-all"
            style={{
              background: copied ? 'var(--success)' : 'var(--brand)',
              color: 'var(--bg)',
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copiado!' : 'Copiar system prompt'}
          </button>
        </div>
        <pre
          className="mono mt-4 overflow-auto rounded-lg p-4 text-[11.5px] leading-relaxed"
          style={{
            background: 'var(--bg)',
            color: 'var(--text-soft)',
            maxHeight: 360,
          }}
        >
          <code>{SYSTEM_PROMPT}</code>
        </pre>
      </Showcase>

      <SubHead num="15.1" title="Índice de prompts" italic="por categoria · 1 prompt por componente" />

      {componentGroups.map((g) => (
        <section key={g.id} className="mb-6">
          <h3
            className="mono mb-2 text-[10.5px] font-bold uppercase tracking-[1.6px]"
            style={{ color: 'var(--text-mute)' }}
          >
            {g.label}
          </h3>
          <div className="grid grid-cols-3 gap-2 max-[760px]:grid-cols-2 max-[480px]:grid-cols-1">
            {g.items.map((it) => (
              <Link
                key={it.to}
                to={it.to as any}
                className="flex items-center gap-2 rounded-lg border px-3 py-2.5 no-underline transition-all hover:brightness-110"
                style={{
                  background: 'var(--surface-1)',
                  borderColor: 'var(--line-1)',
                }}
              >
                <Bot size={13} style={{ color: 'var(--brand)' }} strokeWidth={1.7} />
                <span className="mono text-[10px] font-bold" style={{ color: 'var(--text-mute)' }}>
                  {it.num}
                </span>
                <span className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>
                  {it.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
