import { toast } from 'sonner'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { DealCard, DealLaneTotal, type Deal } from '@/components/tkws/crm-deal-card'
import type { AIPrompt } from '@/lib/prompts'

const sampleDeals: Deal[] = [
  {
    id: '1',
    account: 'FAMÍLIA ANDRADE',
    title: 'Yachthouse 2104 · Decoração completa',
    value: 1_250_000_000,
    probability: 78,
    expectedClose: '15 jun',
    owner: { initials: 'LZ', name: 'Lucas Z.', color: 'var(--brand)' },
    temperature: 'hot',
    tag: { label: 'VIP', tone: 'brand' },
  },
  {
    id: '2',
    account: 'WS GROUP',
    title: 'Cobertura Titanium · 920 m² · Premium',
    value: 950_000_000,
    probability: 62,
    expectedClose: '02 jul',
    owner: { initials: 'AV', name: 'Ana V.', color: 'var(--purple)' },
    temperature: 'warm',
  },
  {
    id: '3',
    account: 'FAMÍLIA COSTA',
    title: 'Vitra 1801 · Reforma + decoração',
    value: 420_000_000,
    probability: 32,
    expectedClose: '20 ago',
    owner: { initials: 'JQ', name: 'João Q.', color: 'var(--success)' },
    temperature: 'cold',
    tag: { label: 'Referência', tone: 'purple' },
  },
]

const prompt: AIPrompt = {
  componente: 'CRM · DealCard',
  import: "import { DealCard, DealLaneTotal, type Deal } from '@/components/tkws/crm-deal-card'",
  contexto:
    'Cartão de oportunidade/deal no pipeline. Inclui account (mono uppercase), título Fraunces, valor, close date, LeadScore temperature, Progress de probabilidade, owner avatar e tag opcional. Click abre Sheet de detalhes.',
  quandoUsar: [
    'Cards no Kanban de pipeline comercial',
    'Lista de deals em Sheet do contato',
    'Forecast widget no dashboard',
  ],
  props: [
    { name: 'deal', type: 'Deal', description: '{ account, title, value (cents), probability, expectedClose, owner, temperature?, tag? }' },
    { name: 'onClick', type: '() => void', description: 'Click no card · abre Sheet' },
    { name: 'onMore', type: '() => void', description: 'Click no kebab (aparece em hover)' },
  ],
  antiPatterns: [
    'Valor sem formatCurrency · use sempre Intl',
    'Probability sem semantic color · perde leitura',
    'Cards sem temperature em pipeline · perde insight',
  ],
  exemplo: `const deal: Deal = {
  id: '1',
  account: 'FAMÍLIA ANDRADE',
  title: 'Yachthouse · Decoração full',
  value: 1_250_000_000,           // 12.5M em centavos
  probability: 78,
  expectedClose: '15 jun',
  owner: { initials: 'LZ', name: 'Lucas Z.' },
  temperature: 'hot',
  tag: { label: 'VIP', tone: 'brand' }
}

<DealCard deal={deal} onClick={() => openDetail(deal.id)} />`,
  relacionados: ['LeadScore', 'Card', 'Kanban'],
}

export function CrmDealCardPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="CRM.4"
        category="CRM · DealCard"
        title="Deal Card"
        italic="cartão de oportunidade"
        description="Card de pipeline comercial. Account · título · valor · probabilidade · close date · temperature · owner."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="3 deals com temperaturas diferentes" />
      <Showcase>
        <div className="grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">
          {sampleDeals.map((d) => (
            <DealCard key={d.id} deal={d} onClick={() => toast.success(`Abriu ${d.title}`)} />
          ))}
        </div>
      </Showcase>

      <SubHead num="B" title="Lane Total · header de coluna do Kanban" />
      <Showcase>
        <div className="grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">
          <DealLaneTotal label="Lead" count={14} total={2_400_000_000} trend={{ value: '+12% mês', positive: true }} />
          <DealLaneTotal label="Negociação" count={6} total={4_800_000_000} trend={{ value: '+8% mês', positive: true }} />
          <DealLaneTotal label="Perdido (mês)" count={3} total={520_000_000} trend={{ value: '-22% mês', positive: false }} />
        </div>
      </Showcase>
    </div>
  )
}
