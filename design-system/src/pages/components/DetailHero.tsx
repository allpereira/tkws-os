import { Edit3, Share2 } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { DetailHero } from '@/components/tkws/detail-hero'
import { Button } from '@/components/ui/button'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'DetailHero',
  import: "import { DetailHero } from '@/components/tkws/detail-hero'",
  contexto:
    'Header hero para Detail screen · capa + título + status + meta (KPIs) + actions. Layout 160px + 1fr. Mobile vira 1 coluna. Use sempre em telas de detalhe de projeto/cliente/fornecedor — substitui Header.',
  quandoUsar: [
    'Topo de Detail screen · 1 registro com múltiplas abas',
    'Cliente / projeto / fornecedor com capa visual',
    'Quando há 3-4 KPIs principais que valem a pena destacar',
  ],
  props: [
    { name: 'cover', type: 'ReactNode', description: 'Render / placeholder · aspect 4/5' },
    { name: 'code / title / italic / subtitle', type: 'string', description: 'Hierarquia editorial' },
    { name: 'status', type: '{ label, tone }', description: 'Badge no canto superior direito' },
    { name: 'meta', type: 'DetailHeroMeta[]', description: '4 KPIs em grid' },
    { name: 'actions', type: 'ReactNode', description: 'Botões inferiores' },
  ],
  antiPatterns: [
    'DetailHero sem cover · perde o tom visual',
    'Meta com 5+ valores · vire KPI cards abaixo',
  ],
  exemplo: `<DetailHero
  cover={<img src={renderUrl} className="h-full w-full object-cover" />}
  code="PROJETO #2410 · REV.0"
  title="Yachthouse 2104"
  italic="Family Andrade"
  subtitle="Apartamento residencial · 280 m² · BC/SC"
  status={{ label: 'Em obra', tone: 'warning' }}
  meta={[
    { label: 'Contrato', value: 'R$ 12,5M' },
    { label: 'Margem', value: '31%' },
    { label: 'Squad', value: 'Orion' },
    { label: 'Entrega', value: '15/06' }
  ]}
  actions={<>
    <Button variant="outline" size="sm"><Edit3 size={12}/> Editar</Button>
    <Button size="sm"><Share2 size={12}/> Compartilhar</Button>
  </>}
/>`,
  relacionados: ['Header', 'Tabs (underline)'],
}

export function DetailHeroPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="12.2"
        category="Layout · Detail Hero"
        title="Detail Hero"
        italic="topo de Detail screen"
        description="Capa + título editorial + status + KPIs. Substitui Header em telas de detalhe."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Projeto · Yachthouse 2104" />
      <Showcase>
        <DetailHero
          cover={
            <div
              className="flex h-full w-full items-center justify-center"
              style={{
                background:
                  'linear-gradient(135deg, var(--surface-3) 0%, var(--surface-2) 100%)',
                color: 'var(--text-mute)',
              }}
            >
              <span className="mono text-[10.5px] font-bold uppercase tracking-[1.6px]">RENDER PREVIEW</span>
            </div>
          }
          code="PROJETO #2410 · REV.0"
          title="Yachthouse 2104"
          italic="Família Andrade"
          subtitle="Apartamento residencial · 280 m² · Balneário Camboriú, SC"
          status={{ label: 'Em obra · atrasado', tone: 'danger' }}
          meta={[
            { label: 'Contrato', value: 'R$ 12,5M' },
            { label: 'Margem', value: '31%' },
            { label: 'Squad', value: 'Orion' },
            { label: 'Entrega', value: '15/06' },
          ]}
          actions={
            <>
              <Button variant="outline" size="sm">
                <Edit3 size={12} /> Editar
              </Button>
              <Button size="sm">
                <Share2 size={12} /> Compartilhar
              </Button>
            </>
          }
        />
      </Showcase>
    </div>
  )
}
