import { Download, Plus } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { TkwsHeader, Subheader } from '@/components/tkws/header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Header · Subheader',
  import: "import { TkwsHeader, Subheader } from '@/components/tkws/header'",
  contexto:
    'Header editorial de página · crumb (mono uppercase) → título Fraunces light com itálico → desc Inter → actions. Subheader divide seções internas com label mono e actions à direita. NUNCA omita o crumb em telas de detalhe.',
  quandoUsar: [
    'Topo de toda tela principal',
    'Subheader entre blocos da mesma tela (Saúde Financeira · Operação · Squads)',
  ],
  props: [
    { name: 'crumb', type: 'string', description: 'Contexto curto · ex: "Projetos · Squad Orion"' },
    { name: 'title / italic', type: 'ReactNode', description: 'Italic vira cyan dentro do título' },
    { name: 'description', type: 'string', description: 'Linha de contexto · Inter regular' },
    { name: 'actions', type: 'ReactNode', description: 'Botões à direita' },
  ],
  antiPatterns: [
    'Title em Inter bold · perde o tom editorial',
    'Mais de 1 botão primário em actions',
    'Description com 3+ linhas · vire bloco separado',
  ],
  exemplo: `<TkwsHeader
  crumb="Projetos · Squad Orion"
  title="43 projetos"
  italic="R$ 87,4M em portfólio"
  description="Gestão completa do portfólio · da captação à entrega"
  actions={
    <>
      <Button variant="outline" size="sm"><Download size={12}/> Exportar</Button>
      <Button><Plus size={14}/> Novo projeto</Button>
    </>
  }
/>`,
  relacionados: ['DetailHero', 'PageHeader (docs)'],
}

export function HeaderPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="12.1"
        category="Layout · Header"
        title="Header · Subheader"
        italic="hierarquia de página"
        description="Topo editorial de toda tela. Crumb → Title → Desc → Actions. Subheader divide seções internas."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Page Header" italic="topo de tela" />
      <Showcase>
        <TkwsHeader
          crumb="Projetos · Squad Orion"
          title="43 projetos"
          italic="R$ 87,4M em portfólio"
          description="Gestão completa do portfólio · da captação à entrega"
          actions={
            <>
              <Button variant="outline" size="sm">
                <Download size={12} /> Exportar
              </Button>
              <Button>
                <Plus size={14} /> Novo projeto
              </Button>
            </>
          }
        />
      </Showcase>

      <SubHead num="B" title="Subheader" italic="separação de seção interna" />
      <Showcase>
        <div className="grid gap-6">
          <div>
            <Subheader
              label="Saúde Financeira"
              actions={<Button variant="ghost" size="sm">ver tudo →</Button>}
            />
            <div className="mt-4 text-[13px]" style={{ color: 'var(--text-soft)' }}>
              Conteúdo da seção segue aqui · KPIs, tabelas, gráficos.
            </div>
          </div>
          <div>
            <Subheader label="Operação · Squads" actions={<Badge tone="brand">7 squads · 38 pessoas</Badge>} />
          </div>
        </div>
      </Showcase>
    </div>
  )
}
