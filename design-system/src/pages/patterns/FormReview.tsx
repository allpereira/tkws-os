import { Check, ChevronLeft, Edit3 } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'
import type { AIPrompt } from '@/lib/prompts'

const sections = [
  {
    title: 'Identificação',
    items: [
      ['Nome', 'Yachthouse 2104'],
      ['Código', '#2410'],
      ['Cliente', 'Família Andrade'],
      ['Cidade', 'Balneário Camboriú · SC'],
    ],
  },
  {
    title: 'Contrato',
    items: [
      ['Valor', formatCurrency(12_500_000)],
      ['Margem alvo', '32%'],
      ['Entrega prevista', '15/06/2026'],
    ],
  },
  {
    title: 'Escopo',
    items: [
      ['Tipo', 'Decoração completa'],
      ['Área', '280 m²'],
      ['Ambientes', '5 (living, cozinha, master, BWC master, varanda)'],
    ],
  },
  {
    title: 'Squad',
    items: [
      ['Squad responsável', 'Orion · signature'],
      ['Líder', 'Lucas Z.'],
      ['Equipe', '5 pessoas'],
    ],
  },
]

const prompt: AIPrompt = {
  componente: 'Pattern · Form Review',
  import: '// Composição: read-only sections + Edit links + final confirm',
  contexto:
    'Etapa final antes do submit em wizards longos. Mostra TUDO que foi preenchido em modo leitura, com link "Editar" por seção para voltar. Use Alert no topo para destacar implicações (custos, prazos, ações destrutivas).',
  quandoUsar: [
    'Última etapa do Wizard de novo projeto',
    'Confirmação antes de fechar orçamento',
    'Revisão antes de enviar cotação para fornecedores',
  ],
  props: [],
  antiPatterns: [
    'Review como página separada sem voltar fácil',
    'Sem badges de status (revisar / pendente / ok)',
    'Submeter sem essa etapa em fluxos críticos',
  ],
  exemplo: `// Após etapa final do Wizard:
// 1) Mostra <ReviewSection title="Identificação" data={form.values.basic} onEdit={() => setStep(0)} />
// 2) Alert avisa: "Ao confirmar, o cliente recebe email + portal é ativado"
// 3) Botão único: 'Confirmar e criar projeto'`,
  relacionados: ['Wizard', 'Form sectioned'],
}

export function FormReviewPattern() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="P10.3"
        category="Pattern · Form Review"
        title="Form Review"
        italic="confirmação final"
        description="Última etapa de Wizard ou criação. Read-only com link Editar por seção. Alerts destacam implicações."
        tag="confirmar antes de enviar"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Revisar antes de criar projeto" />
      <Showcase>
        <Alert tone="warning">
          <AlertTitle>Ao confirmar, as seguintes ações acontecem automaticamente:</AlertTitle>
          <AlertDescription>
            (1) Cliente recebe email de boas-vindas com link do portal · (2) Squad Orion é notificado · (3) Cronograma inicial é gerado · (4) Briefing template é criado e atribuído ao líder.
          </AlertDescription>
        </Alert>

        <div className="mt-5 grid gap-4">
          {sections.map((s) => (
            <article
              key={s.title}
              className="overflow-hidden rounded-xl border"
              style={{ background: 'var(--surface-1)', borderColor: 'var(--line-1)' }}
            >
              <header
                className="flex items-center justify-between border-b px-5 py-3"
                style={{ borderColor: 'var(--line-1)' }}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full"
                    style={{ background: 'var(--success)', color: 'var(--bg)' }}
                  >
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <h4
                    className="serif text-[18px] font-normal tracking-tight"
                    style={{ color: 'var(--text)' }}
                  >
                    {s.title}
                  </h4>
                </div>
                <Button variant="outline" size="sm">
                  <Edit3 size={12} /> Editar
                </Button>
              </header>
              <dl className="grid grid-cols-2 gap-px max-[760px]:grid-cols-1" style={{ background: 'var(--line-1)' }}>
                {s.items.map(([k, v]) => (
                  <div key={k} className="p-4" style={{ background: 'var(--surface-1)' }}>
                    <dt
                      className="mono text-[9.5px] font-bold uppercase tracking-[1.4px]"
                      style={{ color: 'var(--text-mute)' }}
                    >
                      {k}
                    </dt>
                    <dd className="mt-1 text-[14px] font-semibold" style={{ color: 'var(--text)' }}>
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>

        <Separator className="my-6" />

        <div className="flex items-center justify-between gap-3">
          <Button variant="outline">
            <ChevronLeft size={14} /> Voltar para Squad
          </Button>
          <div className="flex items-center gap-3">
            <Badge tone="success">Tudo validado</Badge>
            <Button>Confirmar e criar projeto</Button>
          </div>
        </div>
      </Showcase>
    </div>
  )
}
