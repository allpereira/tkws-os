import * as React from 'react'
import {
  CheckCircle2,
  ChevronDown,
  Heart,
  Hexagon,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
  X,
} from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Kbd } from '@/components/ui/kbd'
import { Rating } from '@/components/ui/rating'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle'
import { ProductCard } from '@/components/tkws/product-card'
import { CategoryTree } from '@/components/tkws/category-tree'
import { cn } from '@/lib/utils'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Pattern · Catálogo de Produtos · 7 telas',
  import: '// Composição: CategoryTree + ProductCard + ProductDetail + CartDrawer + CompareGrid + SearchOmni',
  contexto:
    'E-commerce do ofício · Catálogo curado de materiais e serviços para arquitetos. 7 telas/padrões: (A) Landing com sidebar + grid; (B) Lista horizontal; (C) Product detail com gallery + opções + specs; (D) Service cards; (E) Cart drawer lateral; (F) Compare 3 produtos; (G) Search omni com autocomplete. Visual em primeiro plano, ficha técnica completa.',
  quandoUsar: [
    'Catálogo de produtos curados pelo escritório',
    'Marketplace de fornecedores homologados',
    'Showcase de moodboards / referências',
    'Carrinho persistente vinculado ao projeto',
    'Comparação técnica de produtos (PEI, formato, preço)',
  ],
  props: [],
  antiPatterns: [
    'Catálogo como Table · perde tom editorial',
    'Cards sem imagem · catálogo é visual',
    'Compare sem highlight de vencedor · sem direção',
    'Cart sem persistência por projeto · perde contexto',
  ],
  exemplo: `// Landing
<CategoryTree categories={...} />
<ProductCard {...} variant="featured" />

// Detail
<ProductDetail
  product={...}
  variations={['polido', 'acetinado']}
  onAddToCart={(qty) => addToCart(p.id, qty)}
/>`,
  relacionados: ['ProductCard', 'CategoryTree', 'FilterSidebar', 'Rating'],
}

// =============================================================================
// PRODUCT GRID + LANDING DATA
// =============================================================================

const products = [
  {
    id: 1,
    code: 'PORC · CL-120-04',
    name: <>Porcelanato <em className="italic font-normal" style={{ color: 'var(--text-soft)' }}>Calacatta Gold</em> · 120×120</>,
    supplier: 'ELIANE · BRASIL · POLIDO',
    price: 34200,
    priceOld: 38000,
    priceUnit: '/m²',
    rating: { stars: 4.9, count: 84 },
    badge: { label: 'Curadoria', tone: 'featured' as const },
    swatches: ['#E8E2D0', '#6B4F2E', '#A89484'],
    imagePlaceholder: 'linear-gradient(135deg, #E8E2D0 0%, #A89484 100%)',
    stock: { state: 'in' as const, customLabel: 'Em estoque · entrega 8 dias' },
    wished: true,
    featured: true,
  },
  {
    id: 2,
    code: 'MAD · TR-300',
    name: <>Madeira <em className="italic font-normal" style={{ color: 'var(--text-soft)' }}>Tauari</em></>,
    supplier: 'INDUSPARQUET · 30×120',
    price: 24800,
    priceUnit: '/m²',
    rating: { stars: 4.8, count: 62 },
    badge: { label: 'Novo', tone: 'new' as const },
    swatches: ['#B8A07A', '#8B6F4A'],
    imagePlaceholder: 'linear-gradient(135deg, #B8A07A 0%, #6B4F2E 100%)',
    stock: { state: 'in' as const },
  },
  {
    id: 3,
    code: 'PORC · MR-90-12',
    name: <>Porcelanato <em className="italic font-normal" style={{ color: 'var(--text-soft)' }}>Mármore Bianco</em></>,
    supplier: 'PORTOBELLO · 90×90',
    price: 16200,
    priceOld: 19800,
    priceUnit: '/m²',
    rating: { stars: 4.6, count: 42 },
    badge: { label: '−18%', tone: 'sale' as const },
    swatches: ['#D8C9B5', '#3A3A3A', '#FFFFFF'],
    imagePlaceholder: 'linear-gradient(135deg, #F5F0E5 0%, #D8C9B5 100%)',
    stock: { state: 'warn' as const, customLabel: 'Últimas 24 m²' },
  },
  {
    id: 4,
    code: 'VIN · LV-220',
    name: <>Vinílico <em className="italic font-normal" style={{ color: 'var(--text-soft)' }}>Linwood</em></>,
    supplier: 'DURAFLOOR · CLICK',
    price: 9600,
    priceUnit: '/m²',
    rating: { stars: 4.4, count: 28 },
    swatches: ['#5D4E3F', '#2C2419'],
    imagePlaceholder: 'linear-gradient(135deg, #5D4E3F 0%, #2C2419 100%)',
    stock: { state: 'order' as const, customLabel: 'Sob encomenda · 28d' },
  },
  {
    id: 5,
    code: 'MAD · IP-200',
    name: <>Ipê <em className="italic font-normal" style={{ color: 'var(--text-soft)' }}>Tauari Premium</em></>,
    supplier: 'PISOS MARTINS · 20×200',
    price: 58400,
    priceUnit: '/m²',
    rating: { stars: 5.0, count: 18 },
    badge: { label: 'Exclusivo', tone: 'exclusive' as const },
    swatches: ['#1F1A14'],
    imagePlaceholder: 'linear-gradient(135deg, #2C2419 0%, #1F1A14 100%)',
    stock: { state: 'in' as const },
  },
  {
    id: 6,
    code: 'PORC · CT-80-06',
    name: <>Porcelanato <em className="italic font-normal" style={{ color: 'var(--text-soft)' }}>Concreto</em></>,
    supplier: 'ELIANE · 80×80 · ANTIDERRAPANTE',
    price: 18400,
    priceUnit: '/m²',
    rating: { stars: 4.7, count: 56 },
    swatches: ['#E8E2D0', '#A09380', '#F5F0E5'],
    imagePlaceholder: 'linear-gradient(135deg, #E8E2D0 0%, #A09380 100%)',
    stock: { state: 'in' as const },
  },
  {
    id: 7,
    code: 'PORC · TV-120-09',
    name: <>Travertino <em className="italic font-normal" style={{ color: 'var(--text-soft)' }}>Romano</em></>,
    supplier: 'DELTA · 120×60',
    price: 28400,
    priceUnit: '/m²',
    rating: { stars: 4.8, count: 162 },
    badge: { label: 'Top vendido', tone: 'brand' as const },
    swatches: ['#E8E2D0', '#D8C9B5'],
    imagePlaceholder: 'linear-gradient(135deg, #E8E2D0 0%, #D8C9B5 100%)',
    stock: { state: 'in' as const },
  },
]

const categories = [
  {
    id: 'pisos',
    label: 'Pisos',
    count: 124,
    children: [
      { id: 'porcelanato', label: 'Porcelanato', count: 42 },
      { id: 'madeira', label: 'Madeira', count: 28 },
      { id: 'vinilico', label: 'Vinílico', count: 22 },
      { id: 'ceramica', label: 'Cerâmica', count: 18 },
      { id: 'pedras', label: 'Pedras naturais', count: 14 },
    ],
  },
  { id: 'rodapes', label: 'Rodapés', count: 38 },
  { id: 'marmores', label: 'Pedras & Mármores', count: 86 },
  { id: 'marcenaria', label: 'Marcenaria', count: 52 },
  { id: 'iluminacao', label: 'Iluminação', count: 198 },
  { id: 'metais', label: 'Metais sanitários', count: 144 },
  { id: 'tintas', label: 'Tintas & vernizes', count: 96 },
  { id: 'cortinas', label: 'Cortinas & tecidos', count: 62 },
  { id: 'mobiliario', label: 'Mobiliário', count: 340 },
  { id: 'clima', label: 'Climatização', count: 48 },
]

// =============================================================================
// SECTION C · PRODUCT DETAIL — local components
// =============================================================================

function ProductDetail() {
  const [activeThumb, setActiveThumb] = React.useState(0)
  const [color, setColor] = React.useState(0)
  const [finish, setFinish] = React.useState('Polido')
  const [format, setFormat] = React.useState('120×120')
  const [qty, setQty] = React.useState(18)
  const unitPrice = 342
  const total = qty * unitPrice

  const thumbs = [
    'linear-gradient(135deg, #E8E2D0 0%, #A89484 100%)',
    'linear-gradient(135deg, #F5F0E5 0%, #D8C9B5 100%)',
    'linear-gradient(135deg, #B8A07A 0%, #6B4F2E 100%)',
    'linear-gradient(135deg, #2C2419 0%, #1F1A14 100%)',
    'linear-gradient(135deg, #A89484 0%, #6B4F2E 100%)',
  ]

  return (
    <div
      className="overflow-hidden rounded-[14px] border"
      style={{ background: 'var(--surface-1)', borderColor: 'var(--line-2)' }}
    >
      {/* Body 2-col · gallery + info */}
      <div className="grid grid-cols-[1fr_460px] max-[900px]:grid-cols-1">
        {/* Gallery */}
        <div
          className="grid grid-cols-[80px_1fr] gap-3 p-4 max-[900px]:grid-cols-1"
          style={{ borderRight: '1px solid var(--line-1)' }}
        >
          <div className="flex flex-col gap-2 max-[900px]:flex-row max-[900px]:overflow-x-auto">
            {thumbs.map((bg, i) => (
              <button
                key={i}
                onClick={() => setActiveThumb(i)}
                className={cn(
                  'aspect-square w-[80px] shrink-0 cursor-pointer rounded-[8px] transition-all',
                  activeThumb === i ? 'ring-2 ring-[var(--brand)]' : 'ring-1 ring-[var(--line-1)] hover:ring-[var(--line-3)]'
                )}
                style={{ background: bg }}
              />
            ))}
          </div>
          <div
            className="relative flex aspect-[4/5] items-end justify-start overflow-hidden rounded-[10px] p-4 max-[900px]:aspect-[4/3]"
            style={{ background: thumbs[activeThumb] }}
          >
            <span
              className="mono rounded-[6px] px-2 py-1 text-[10px] font-semibold uppercase tracking-[1.3px]"
              style={{ background: 'rgba(0,0,0,0.55)', color: '#fff', backdropFilter: 'blur(8px)' }}
            >
              Vista · Living aplicado · 4K
            </span>
          </div>
        </div>

        {/* Info pane */}
        <div className="flex flex-col gap-4 p-5">
          <div
            className="mono text-[10.5px] font-semibold uppercase tracking-[1.3px]"
            style={{ color: 'var(--text-mute)' }}
          >
            Catálogo · Pisos · Porcelanato
          </div>
          <h2
            className="serif text-[26px] font-normal leading-[1.1]"
            style={{ color: 'var(--text)', letterSpacing: '-0.025em' }}
          >
            Porcelanato{' '}
            <em className="italic font-normal" style={{ color: 'var(--text-soft)' }}>
              Calacatta Gold
            </em>{' '}
            · 120×120
          </h2>
          <div className="flex items-center gap-2">
            <Rating value={5} readOnly size={16} />
            <span className="mono text-[11.5px]" style={{ color: 'var(--text-mute)' }}>
              4.9 · 84 avaliações · 1.2k vendidos
            </span>
          </div>

          {/* Price block */}
          <div
            className="flex flex-col gap-1 rounded-[10px] border px-4 py-3"
            style={{ background: 'var(--surface-2)', borderColor: 'var(--line-1)' }}
          >
            <div className="flex items-baseline gap-2">
              <span
                className="mono text-[12px] line-through"
                style={{ color: 'var(--text-mute)' }}
              >
                R$ 380/m²
              </span>
              <Badge tone="success">−10% até 30/05</Badge>
            </div>
            <div
              className="serif font-light leading-none"
              style={{ fontSize: 36, letterSpacing: '-0.025em', color: 'var(--text)' }}
            >
              R${' '}
              <em className="italic" style={{ color: 'var(--brand)' }}>
                342
              </em>
              <em className="italic ml-1 text-[18px]" style={{ color: 'var(--text-soft)' }}>
                /m²
              </em>
            </div>
            <div className="text-[12px]" style={{ color: 'var(--text-mute)' }}>
              ou 8× R$ 42,75 sem juros · pagamento direto via portal
            </div>
          </div>

          {/* Cor / Tom */}
          <OptionBlock
            label="Cor / Tom"
            selected={
              <>
                Selecionado:{' '}
                <em className="italic" style={{ color: 'var(--text)' }}>
                  Calacatta clássico
                </em>
              </>
            }
          >
            <SwatchPicker
              swatches={['#E8E2D0', '#D8C9B5', '#A89484', '#6B4F2E']}
              value={color}
              onChange={setColor}
            />
          </OptionBlock>

          <OptionBlock label="Acabamento">
            <OptionChips
              options={[
                { label: 'Polido' },
                { label: 'Acetinado' },
                { label: 'Antiderrapante', disabled: true },
              ]}
              value={finish}
              onChange={setFinish}
            />
          </OptionBlock>

          <OptionBlock label="Formato">
            <OptionChips
              options={[
                { label: '60×60' },
                { label: '90×90' },
                { label: '120×120' },
                { label: '120×240' },
              ]}
              value={format}
              onChange={setFormat}
            />
          </OptionBlock>

          <OptionBlock
            label="Quantidade"
            selected={
              <>
                Total:{' '}
                <em className="serif italic" style={{ color: 'var(--brand)', fontSize: 14 }}>
                  R$ {total.toLocaleString('pt-BR')}
                </em>
              </>
            }
          >
            <div className="flex items-center gap-2">
              <QtyStepper value={qty} onChange={setQty} min={1} />
              <Button className="flex-1">
                <Plus size={14} /> Adicionar ao projeto · R$ {total.toLocaleString('pt-BR')}
              </Button>
            </div>
            <span className="mt-1.5 block text-[12px]" style={{ color: 'var(--text-mute)' }}>
              {qty} m² · cobre 1 ambiente · com 5% de quebra técnica
            </span>
          </OptionBlock>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Heart size={12} /> Favoritar
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Hexagon size={12} /> Comparar
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Compartilhar
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs · spec / aplicação / docs / avaliações */}
      <div style={{ borderTop: '1px solid var(--line-1)' }}>
        <Tabs defaultValue="specs">
          <div className="px-5 pt-3">
            <TabsList variant="underline">
              <TabsTrigger value="specs" underline>
                Especificações
              </TabsTrigger>
              <TabsTrigger value="app" underline>
                Aplicação
              </TabsTrigger>
              <TabsTrigger value="docs" underline>
                Documentos · 3
              </TabsTrigger>
              <TabsTrigger value="reviews" underline>
                Avaliações · 84
              </TabsTrigger>
              <TabsTrigger value="usage" underline>
                Onde foi usado
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="grid grid-cols-2 gap-7 p-5 max-[760px]:grid-cols-1">
            <div>
              <h6
                className="mono mb-3 text-[10px] font-semibold uppercase tracking-[1.3px]"
                style={{ color: 'var(--text-mute)' }}
              >
                Ficha técnica
              </h6>
              <dl className="grid grid-cols-[130px_1fr] gap-x-4 gap-y-1.5 text-[13px]">
                {[
                  ['DIMENSÕES', '120 × 120 × 0.9 cm'],
                  ['PEÇAS / CAIXA', '2 peças · 2,88 m²'],
                  ['PESO', '28,8 kg/m²'],
                  ['ABSORÇÃO', '≤ 0,5% (BIa)'],
                  ['RESISTÊNCIA', 'PEI 4 · escala mundial'],
                  ['RETIFICADO', '✓ Sim'],
                  ['CERTIFICAÇÃO', 'ISO 13006 · ABNT'],
                  ['ORIGEM', 'Cocal do Sul · SC · Brasil'],
                ].map(([k, v], i) => (
                  <React.Fragment key={i}>
                    <dt
                      className="mono text-[10.5px]"
                      style={{ color: 'var(--text-mute)', letterSpacing: '0.5px' }}
                    >
                      {k}
                    </dt>
                    <dd
                      className="font-semibold"
                      style={{
                        color: k === 'RETIFICADO' ? 'var(--success)' : 'var(--text)',
                      }}
                    >
                      {v}
                    </dd>
                  </React.Fragment>
                ))}
              </dl>
            </div>
            <div>
              <h6
                className="mono mb-3 text-[10px] font-semibold uppercase tracking-[1.3px]"
                style={{ color: 'var(--text-mute)' }}
              >
                Garantia & Suporte
              </h6>
              <ul className="flex flex-col gap-2.5 text-[13px]" style={{ color: 'var(--text)' }}>
                {[
                  '10 anos de garantia contra defeitos de fabricação',
                  'Suporte técnico TKWS · cotação em até 12h',
                  'Entrega rastreada via portal',
                  'Devolução em até 7 dias se não aplicado',
                ].map((s) => (
                  <li key={s} className="flex items-center gap-2.5">
                    <CheckCircle2 size={14} style={{ color: 'var(--success)' }} />
                    {s}
                  </li>
                ))}
                <li className="flex items-center gap-2.5" style={{ color: 'var(--text-mute)' }}>
                  <span
                    className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border"
                    style={{ borderColor: 'var(--line-3)' }}
                  />
                  Instalação · cotada separadamente (ver serviços)
                </li>
              </ul>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

function OptionBlock({
  label,
  selected,
  children,
}: {
  label: string
  selected?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span
          className="mono text-[10.5px] font-semibold uppercase tracking-[1.2px]"
          style={{ color: 'var(--text-mute)' }}
        >
          {label}
        </span>
        {selected && (
          <span className="text-[11.5px]" style={{ color: 'var(--text-mute)' }}>
            {selected}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

function SwatchPicker({
  swatches,
  value,
  onChange,
}: {
  swatches: string[]
  value: number
  onChange: (i: number) => void
}) {
  return (
    <div className="flex gap-2">
      {swatches.map((c, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={cn(
            'h-9 w-9 cursor-pointer rounded-full transition-all',
            value === i ? 'ring-2 ring-offset-2' : 'ring-1 ring-[var(--line-2)] hover:ring-[var(--line-3)]'
          )}
          style={{
            background: c,
            // @ts-expect-error css var
            '--tw-ring-color': value === i ? 'var(--brand)' : undefined,
            '--tw-ring-offset-color': value === i ? 'var(--surface-1)' : undefined,
          }}
          aria-label={`Swatch ${i + 1}`}
        />
      ))}
    </div>
  )
}

function OptionChips({
  options,
  value,
  onChange,
}: {
  options: { label: string; disabled?: boolean }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const selected = value === o.label
        return (
          <button
            key={o.label}
            disabled={o.disabled}
            onClick={() => onChange(o.label)}
            className={cn(
              'cursor-pointer rounded-[8px] border px-3 py-1.5 text-[12.5px] font-semibold transition-all',
              o.disabled && 'cursor-not-allowed line-through opacity-40'
            )}
            style={{
              background: selected ? 'var(--brand)' : 'var(--surface-2)',
              color: selected ? 'var(--bg)' : 'var(--text-soft)',
              borderColor: selected ? 'var(--brand)' : 'var(--line-2)',
            }}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

function QtyStepper({
  value,
  onChange,
  min = 0,
  max = 999,
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
}) {
  return (
    <div
      className="inline-flex items-stretch overflow-hidden rounded-[10px] border"
      style={{ background: 'var(--surface-2)', borderColor: 'var(--line-2)' }}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-9 w-9 cursor-pointer items-center justify-center transition-colors hover:bg-[var(--surface-3)]"
        style={{ color: 'var(--text-soft)' }}
      >
        <Minus size={12} />
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const v = parseInt(e.target.value, 10)
          if (!isNaN(v)) onChange(Math.max(min, Math.min(max, v)))
        }}
        className="num-tabular w-12 bg-transparent text-center text-[14px] font-semibold outline-none"
        style={{ color: 'var(--text)' }}
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-9 w-9 cursor-pointer items-center justify-center transition-colors hover:bg-[var(--surface-3)]"
        style={{ color: 'var(--text-soft)' }}
      >
        <Plus size={12} />
      </button>
    </div>
  )
}

// =============================================================================
// SECTION D · SERVICE CARDS
// =============================================================================

const services = [
  {
    cat: 'SERVIÇO · MÃO-DE-OBRA',
    name: <>Instalação de <em className="italic font-normal" style={{ color: 'var(--text-soft)' }}>porcelanato</em></>,
    desc: 'Aplicação por equipe homologada TKWS. Inclui rejunte, limpeza pós-obra e nivelamento. Garantia de 2 anos.',
    features: [
      'Equipe homologada · 14 obras TKWS',
      'Rejunte epóxi premium incluído',
      'Nivelamento a laser · ±1mm',
      'Limpeza pós-obra inclusa',
      'Garantia 2 anos · contratual',
    ],
    metaK: 'A partir de',
    metaV: <>R$ <em className="serif italic" style={{ color: 'var(--brand)' }}>180</em>/m²</>,
    cta: 'Solicitar cotação',
    recommended: true,
    Icon: Sparkles,
  },
  {
    cat: 'SERVIÇO · CONSULTORIA',
    name: <>Projeto <em className="italic font-normal" style={{ color: 'var(--text-soft)' }}>luminotécnico</em></>,
    desc: 'Cálculo de luminância por ambiente, especificação de luminárias, posicionamento e diagrama elétrico.',
    features: [
      'Cálculo de lux por ambiente',
      'Especificação de luminárias',
      'Diagrama elétrico em DWG',
      'Memorial descritivo',
      '3 revisões inclusas',
    ],
    metaK: 'Forfait',
    metaV: <>R$ <em className="serif italic" style={{ color: 'var(--brand)' }}>3.400</em></>,
    cta: 'Agendar',
    Icon: Hexagon,
  },
  {
    cat: 'SERVIÇO · VISTORIA',
    name: <>Vistoria <em className="italic font-normal" style={{ color: 'var(--text-soft)' }}>de obra</em></>,
    desc: 'Inspeção técnica completa em obra. Punch list com fotos, classificação de pendências e prazo sugerido.',
    features: [
      'Vistoria presencial · 2h',
      'Relatório PDF com fotos',
      'Punch list classificada',
      'Recomendações técnicas',
    ],
    metaK: 'Visita',
    metaV: <>R$ <em className="serif italic" style={{ color: 'var(--brand)' }}>480</em></>,
    cta: 'Agendar',
    Icon: CheckCircle2,
  },
]

function ServiceCards() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
      {services.map((s, i) => (
        <div
          key={i}
          className="relative flex flex-col gap-3 rounded-[14px] border p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-2)]"
          style={{
            background: 'var(--surface-1)',
            borderColor: s.recommended ? 'var(--brand)' : 'var(--line-2)',
          }}
        >
          {s.recommended && (
            <span className="absolute -top-2.5 right-4">
              <Badge tone="brand">Recomendado</Badge>
            </span>
          )}
          <span
            className="inline-flex h-10 w-10 items-center justify-center rounded-[10px]"
            style={{ background: 'var(--brand-soft)', color: 'var(--brand)' }}
          >
            <s.Icon size={20} strokeWidth={1.8} />
          </span>
          <div
            className="mono text-[10px] font-semibold uppercase tracking-[1.3px]"
            style={{ color: 'var(--text-mute)' }}
          >
            {s.cat}
          </div>
          <h4
            className="serif text-[19px] font-normal leading-[1.15]"
            style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
          >
            {s.name}
          </h4>
          <p className="text-[12.5px] leading-[1.55]" style={{ color: 'var(--text-soft)' }}>
            {s.desc}
          </p>
          <ul className="flex flex-col gap-1.5">
            {s.features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 text-[12px]"
                style={{ color: 'var(--text-soft)' }}
              >
                <CheckCircle2
                  size={12}
                  strokeWidth={2.2}
                  style={{ color: 'var(--success)', flexShrink: 0, marginTop: 3 }}
                />
                {f}
              </li>
            ))}
          </ul>
          <div
            className="mt-auto flex items-center justify-between border-t pt-3"
            style={{ borderColor: 'var(--line-1)' }}
          >
            <div>
              <div
                className="mono text-[9.5px] font-semibold uppercase tracking-[1.2px]"
                style={{ color: 'var(--text-mute)' }}
              >
                {s.metaK}
              </div>
              <div
                className="serif font-light"
                style={{ fontSize: 22, color: 'var(--text)', lineHeight: 1 }}
              >
                {s.metaV}
              </div>
            </div>
            <Button size="sm">{s.cta}</Button>
          </div>
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// SECTION E · CART DRAWER
// =============================================================================

const cartItems = [
  {
    id: 1,
    name: 'Porcelanato Calacatta Gold · 120×120',
    sub: 'ELIANE · PORC · CL-120-04',
    swatch: '#E8E2D0',
    swatchLabel: 'Calacatta clássico · Polido',
    price: 6156,
    qty: 18,
    bg: 'linear-gradient(135deg, #E8E2D0 0%, #A89484 100%)',
  },
  {
    id: 2,
    name: 'Madeira Tauari · 30×120',
    sub: 'INDUSPARQUET · MAD · TR-300',
    swatch: '#B8A07A',
    swatchLabel: 'Verniz fosco',
    price: 7440,
    qty: 30,
    bg: 'linear-gradient(135deg, #B8A07A 0%, #6B4F2E 100%)',
  },
  {
    id: 3,
    name: 'Granito São Gabriel',
    sub: 'M. IMPERIAL · GR-SG-018 · POLIDO',
    swatch: '#E8E2D0',
    swatchLabel: 'Tom natural',
    price: 75600,
    qty: 18,
    bg: 'linear-gradient(135deg, #D8C9B5 0%, #A89484 100%)',
  },
  {
    id: 4,
    name: 'Instalação de porcelanato',
    sub: 'SERVIÇO · 18 m²',
    swatchLabel: 'Equipe homologada · 2 anos',
    price: 3240,
    qty: 18,
    bg: 'var(--brand-soft)',
    isService: true,
  },
]

function CartDrawer() {
  return (
    <div
      className="relative grid h-[600px] overflow-hidden rounded-[12px] border border-dashed"
      style={{ borderColor: 'var(--line-2)', background: 'var(--surface-3)' }}
    >
      {/* Scrim */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(6,24,40,0.55)', backdropFilter: 'blur(4px)' }}
      />
      {/* Drawer */}
      <div
        className="absolute top-0 right-0 bottom-0 flex w-[480px] flex-col max-[760px]:w-full"
        style={{
          background: 'var(--surface-1)',
          borderLeft: '1px solid var(--line-2)',
          boxShadow: 'var(--shadow-4)',
        }}
      >
        {/* Head */}
        <div
          className="flex items-center justify-between border-b px-5 py-4"
          style={{ borderColor: 'var(--line-1)' }}
        >
          <h4
            className="serif text-[20px] font-normal"
            style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}
          >
            Carrinho ·{' '}
            <em className="italic font-normal" style={{ color: 'var(--brand)' }}>
              {cartItems.length} itens
            </em>
          </h4>
          <button
            className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-[6px] transition-colors hover:bg-[var(--surface-2)]"
            style={{ color: 'var(--text-mute)' }}
            aria-label="Fechar"
          >
            <X size={14} />
          </button>
        </div>
        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[64px_1fr_100px] gap-3 border-b px-5 py-3.5"
              style={{ borderColor: 'var(--line-1)' }}
            >
              <div
                className="aspect-[4/5] rounded-[8px]"
                style={{
                  background: item.bg,
                  display: item.isService ? 'flex' : undefined,
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--brand)',
                  fontFamily: item.isService ? 'Fraunces, serif' : undefined,
                  fontSize: item.isService ? 14 : undefined,
                }}
              >
                {item.isService && 'SVC'}
              </div>
              <div className="min-w-0">
                <div className="text-[13.5px] font-semibold" style={{ color: 'var(--text)' }}>
                  {item.name}
                </div>
                <div
                  className="mono mt-0.5 text-[10.5px]"
                  style={{ color: 'var(--text-mute)' }}
                >
                  {item.sub}
                </div>
                {item.swatchLabel && (
                  <div
                    className="mt-1.5 flex items-center gap-1.5 text-[11.5px]"
                    style={{ color: 'var(--text-soft)' }}
                  >
                    {item.swatch && (
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{
                          background: item.swatch,
                          border: '1px solid var(--line-2)',
                        }}
                      />
                    )}
                    {item.swatchLabel}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end justify-between gap-1.5">
                <span
                  className="serif font-light"
                  style={{ fontSize: 16, color: 'var(--text)', lineHeight: 1 }}
                >
                  R$ {item.price.toLocaleString('pt-BR')}
                </span>
                <span
                  className="mono text-[10px]"
                  style={{ color: 'var(--text-mute)' }}
                >
                  {item.qty} {item.isService ? 'm²' : 'pç'}
                </span>
                <button
                  className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-[5px] transition-colors hover:bg-[var(--danger)] hover:[&_svg]:text-[#fff]"
                  style={{ color: 'var(--text-mute)' }}
                  aria-label="Remover"
                >
                  <X size={10} />
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Foot */}
        <div
          className="border-t px-5 py-4"
          style={{ borderColor: 'var(--line-1)', background: 'var(--surface-2)' }}
        >
          <div className="flex flex-col gap-1.5 text-[12.5px]" style={{ color: 'var(--text-soft)' }}>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="num-tabular" style={{ color: 'var(--text)' }}>
                R$ 92.436
              </span>
            </div>
            <div className="flex justify-between">
              <span>Desconto cupom · CALACATTA10</span>
              <span className="num-tabular" style={{ color: 'var(--success)' }}>
                − R$ 684
              </span>
            </div>
            <div className="flex justify-between">
              <span>Frete consolidado</span>
              <span style={{ color: 'var(--success)' }}>
                <Truck size={12} className="inline mr-1" />
                grátis
              </span>
            </div>
            <div
              className="mt-2 flex items-baseline justify-between border-t pt-3"
              style={{ borderColor: 'var(--line-1)' }}
            >
              <span
                className="mono text-[10.5px] font-semibold uppercase tracking-[1.4px]"
                style={{ color: 'var(--text-mute)' }}
              >
                Total
              </span>
              <span
                className="serif font-light"
                style={{ fontSize: 28, letterSpacing: '-0.025em', color: 'var(--text)' }}
              >
                R${' '}
                <em className="italic" style={{ color: 'var(--brand)' }}>
                  91.752
                </em>
              </span>
            </div>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <Button size="lg" className="w-full">
              Finalizar pedido →
            </Button>
            <Button variant="outline" size="sm">
              Continuar comprando
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// SECTION F · COMPARE GRID
// =============================================================================

interface CompareProduct {
  thumb: string
  name: string
  price: string
}
interface CompareRow {
  attr: string
  values: { v: string; win?: 'maior' | 'melhor' | 'único' | 'top' | 'rápido' }[]
}

const compareProducts: CompareProduct[] = [
  {
    thumb: 'linear-gradient(135deg, #E8E2D0 0%, #A89484 100%)',
    name: 'Calacatta Gold',
    price: 'R$ 342/m²',
  },
  {
    thumb: 'linear-gradient(135deg, #F5F0E5 0%, #D8C9B5 100%)',
    name: 'Mármore Bianco',
    price: 'R$ 162/m²',
  },
  {
    thumb: 'linear-gradient(135deg, #E8E2D0 0%, #A09380 100%)',
    name: 'Concreto Polido',
    price: 'R$ 184/m²',
  },
]

const compareRows: CompareRow[] = [
  {
    attr: 'Fornecedor',
    values: [{ v: 'Eliane · BR' }, { v: 'Portobello · BR' }, { v: 'Eliane · BR' }],
  },
  {
    attr: 'Formato',
    values: [{ v: '120×120', win: 'maior' }, { v: '90×90' }, { v: '80×80' }],
  },
  {
    attr: 'Acabamento',
    values: [{ v: 'Polido' }, { v: 'Acetinado' }, { v: 'Acetinado' }],
  },
  {
    attr: 'PEI · Resistência',
    values: [{ v: 'PEI 4', win: 'melhor' }, { v: 'PEI 3' }, { v: 'PEI 3' }],
  },
  {
    attr: 'Antiderrapante',
    values: [{ v: 'Não' }, { v: 'Não' }, { v: 'Sim', win: 'único' }],
  },
  {
    attr: 'Avaliação',
    values: [{ v: '4.9 ⭐', win: 'top' }, { v: '4.6 ⭐' }, { v: '4.7 ⭐' }],
  },
  {
    attr: 'Estoque',
    values: [{ v: 'Em estoque' }, { v: 'Últimas 24 m²' }, { v: 'Em estoque' }],
  },
  {
    attr: 'Prazo',
    values: [{ v: '8 dias' }, { v: '5 dias', win: 'rápido' }, { v: '8 dias' }],
  },
]

function CompareGrid() {
  return (
    <div
      className="overflow-x-auto rounded-[12px] border"
      style={{ background: 'var(--surface-1)', borderColor: 'var(--line-2)' }}
    >
      <div
        className="grid min-w-[640px]"
        style={{ gridTemplateColumns: '160px repeat(3, 1fr)' }}
      >
        {/* Header row */}
        <div
          className="mono p-4 text-[10px] font-semibold uppercase tracking-[1.3px]"
          style={{ color: 'var(--text-mute)', background: 'var(--surface-2)' }}
        >
          Produto
        </div>
        {compareProducts.map((p, i) => (
          <div
            key={i}
            className="relative flex flex-col gap-2 p-4"
            style={{
              background: 'var(--surface-2)',
              borderLeft: '1px solid var(--line-1)',
            }}
          >
            <button
              className="absolute top-2 right-2 inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-[4px] transition-colors hover:bg-[var(--surface-3)]"
              style={{ color: 'var(--text-mute)' }}
            >
              <X size={10} />
            </button>
            <div
              className="aspect-square w-full rounded-[8px]"
              style={{ background: p.thumb }}
            />
            <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
              {p.name}
            </div>
            <div
              className="serif font-light"
              style={{ fontSize: 16, color: 'var(--brand)', letterSpacing: '-0.02em' }}
            >
              {p.price}
            </div>
          </div>
        ))}

        {/* Spec rows */}
        {compareRows.map((row, i) => (
          <React.Fragment key={i}>
            <div
              className="mono px-4 py-3 text-[10px] font-semibold uppercase tracking-[1.3px]"
              style={{
                color: 'var(--text-mute)',
                borderTop: '1px solid var(--line-1)',
              }}
            >
              {row.attr}
            </div>
            {row.values.map((v, j) => (
              <div
                key={j}
                className="flex items-center gap-2 px-4 py-3 text-[12.5px]"
                style={{
                  borderLeft: '1px solid var(--line-1)',
                  borderTop: '1px solid var(--line-1)',
                  background: v.win ? 'var(--brand-soft)' : undefined,
                  color: v.win ? 'var(--brand)' : 'var(--text)',
                  fontWeight: v.win ? 600 : 400,
                }}
              >
                {v.v}
                {v.win && (
                  <span
                    className="mono inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.5px]"
                    style={{
                      borderColor: 'var(--brand)',
                      color: 'var(--brand)',
                    }}
                  >
                    {v.win}
                  </span>
                )}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

// =============================================================================
// SECTION G · SEARCH OMNI
// =============================================================================

function SearchOmni() {
  return (
    <div
      className="overflow-hidden rounded-[14px] border"
      style={{
        background: 'var(--surface-1)',
        borderColor: 'var(--line-3)',
        boxShadow: 'var(--shadow-3)',
        maxWidth: 580,
      }}
    >
      <div
        className="flex items-center gap-3 border-b px-5 py-4"
        style={{ borderColor: 'var(--line-1)' }}
      >
        <Search size={18} style={{ color: 'var(--text-mute)' }} />
        <input
          type="text"
          defaultValue="porcelana"
          placeholder="Buscar produto, fornecedor, código…"
          className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-[var(--text-mute)]"
          style={{ color: 'var(--text)', border: 0 }}
        />
        <Kbd>⌘K</Kbd>
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {/* Group: Produtos */}
        <SearchGroup label="Produtos · 12 resultados">
          <SearchItem
            thumb="linear-gradient(135deg, #E8E2D0 0%, #A89484 100%)"
            highlight="Porcela"
            rest="nato Calacatta Gold · 120×120"
            sub="ELIANE · CL-120-04"
            price="R$ 342/m²"
            active
          />
          <SearchItem
            thumb="linear-gradient(135deg, #E8E2D0 0%, #A09380 100%)"
            highlight="Porcela"
            rest="nato Concreto · 80×80"
            sub="ELIANE · CT-80-06"
            price="R$ 184/m²"
          />
          <SearchItem
            thumb="linear-gradient(135deg, #F5F0E5 0%, #D8C9B5 100%)"
            highlight="Porcela"
            rest="nato Mármore Bianco"
            sub="PORTOBELLO · MR-90-12"
            price="R$ 162/m²"
          />
        </SearchGroup>

        {/* Group: Categorias */}
        <SearchGroup label="Categorias">
          <SearchItem
            iconLabel="CAT"
            iconBg="var(--brand-soft)"
            iconColor="var(--brand)"
            highlight="Porcela"
            rest="nato · em Pisos"
            sub="42 produtos"
          />
        </SearchGroup>

        {/* Group: Fornecedores */}
        <SearchGroup label="Fornecedores">
          <SearchItem
            iconLabel="EL"
            iconBg="var(--purple)"
            iconColor="var(--bg)"
            prefix="Eliane "
            highlight="Porcela"
            rest="natos"
            sub="Cocal do Sul · SC · ⭐ 4.8"
          />
        </SearchGroup>
      </div>
    </div>
  )
}

function SearchGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        className="mono border-y px-5 py-2 text-[9.5px] font-semibold uppercase tracking-[1.3px]"
        style={{
          background: 'var(--surface-2)',
          borderColor: 'var(--line-1)',
          color: 'var(--text-mute)',
        }}
      >
        {label}
      </div>
      <div>{children}</div>
    </div>
  )
}

function SearchItem({
  thumb,
  iconLabel,
  iconBg,
  iconColor,
  prefix,
  highlight,
  rest,
  sub,
  price,
  active,
}: {
  thumb?: string
  iconLabel?: string
  iconBg?: string
  iconColor?: string
  prefix?: string
  highlight: string
  rest: string
  sub?: string
  price?: string
  active?: boolean
}) {
  return (
    <div
      className="grid cursor-pointer grid-cols-[36px_1fr_auto] items-center gap-3 border-b px-5 py-3 transition-colors hover:bg-[var(--brand-soft)]"
      style={{
        borderColor: 'var(--line-1)',
        background: active ? 'var(--brand-soft)' : 'transparent',
      }}
    >
      {thumb ? (
        <div
          className="h-9 w-9 rounded-[6px]"
          style={{ background: thumb }}
        />
      ) : (
        <div
          className="mono inline-flex h-9 w-9 items-center justify-center rounded-[6px] text-[11px] font-extrabold"
          style={{ background: iconBg, color: iconColor }}
        >
          {iconLabel}
        </div>
      )}
      <div>
        <div className="text-[13px]" style={{ color: 'var(--text)' }}>
          {prefix}
          <mark
            style={{ background: 'var(--brand-soft)', color: 'var(--brand)', padding: '0 2px', borderRadius: 3 }}
          >
            {highlight}
          </mark>
          {rest}
        </div>
        {sub && (
          <div
            className="mono mt-0.5 text-[10.5px]"
            style={{ color: 'var(--text-mute)' }}
          >
            {sub}
          </div>
        )}
      </div>
      {price && (
        <span
          className="serif font-light"
          style={{ fontSize: 15, color: 'var(--text)', letterSpacing: '-0.02em' }}
        >
          {price}
        </span>
      )}
    </div>
  )
}

// =============================================================================
// PAGE
// =============================================================================

export function CatalogPattern() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        num="P33"
        category="Pattern · Catálogo"
        title="Catálogo de Produtos"
        italic="e-commerce do ofício · 7 telas"
        description="Catálogo completo: landing + filtros + grid + lista horizontal + product detail + service cards + cart drawer + compare + search omni."
        tag="7 telas"
      />
      <PromptCard prompt={prompt} />

      {/* ======================================================== */}
      {/* A · Landing — sidebar + hero + grid                       */}
      {/* ======================================================== */}
      <SubHead num="A" title="Landing · sidebar + hero + grid" italic="categoria pisos · 124 produtos" />
      <Showcase padding="none">
        <div
          className="overflow-hidden rounded-[12px] border"
          style={{ background: 'var(--surface-1)', borderColor: 'var(--line-2)' }}
        >
          <div
            className="flex items-center gap-3 border-b px-5 py-3"
            style={{ borderColor: 'var(--line-1)', background: 'var(--surface-2)' }}
          >
            <div
              className="flex items-center gap-1.5"
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#FF5F57' }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#FEBC2E' }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#28C840' }} />
            </div>
            <div
              className="mono flex-1 truncate rounded-[6px] border px-3 py-1 text-[10.5px]"
              style={{
                background: 'var(--surface-1)',
                borderColor: 'var(--line-1)',
                color: 'var(--text-mute)',
              }}
            >
              tkws.os <b style={{ color: 'var(--text)' }}>/catalogo/pisos</b>
            </div>
            <span
              className="mono text-[10px]"
              style={{ color: 'var(--text-mute)' }}
            >
              ⌘K busca · ⌘B carrinho
            </span>
          </div>

          <div className="grid grid-cols-[240px_1fr_280px] max-[1100px]:grid-cols-[200px_1fr] max-[900px]:grid-cols-1">
            {/* Category tree */}
            <aside
              className="border-r p-4 max-[900px]:border-r-0 max-[900px]:border-b"
              style={{ borderColor: 'var(--line-1)' }}
            >
              <CategoryTree categories={categories} activeId="pisos" expanded={['pisos']} />
            </aside>

            {/* Main grid */}
            <div className="p-5">
              {/* Hero */}
              <div
                className="mb-5 rounded-[12px] border p-5"
                style={{
                  background:
                    'linear-gradient(135deg, var(--brand-soft) 0%, transparent 70%), var(--surface-2)',
                  borderColor: 'var(--line-2)',
                }}
              >
                <div
                  className="mono mb-2 text-[10px] font-semibold uppercase tracking-[1.3px]"
                  style={{ color: 'var(--text-mute)' }}
                >
                  Catálogo · Pisos
                </div>
                <h2
                  className="serif text-[28px] font-light leading-[1.05]"
                  style={{ color: 'var(--text)', letterSpacing: '-0.025em' }}
                >
                  Pisos para alto{' '}
                  <em className="italic font-light" style={{ color: 'var(--brand)' }}>
                    padrão.
                  </em>
                </h2>
                <p className="mt-2 max-w-2xl text-[13px]" style={{ color: 'var(--text-soft)' }}>
                  124 referências curadas de 18 fornecedores homologados. Porcelanato, madeira, vinílico,
                  cerâmica e pedras naturais — todas com ficha técnica completa, cotações em até 48h.
                </p>
                <div className="mt-3 flex flex-wrap gap-5">
                  {[
                    ['Produtos', '124'],
                    ['Fornecedores', '18 homologados'],
                    ['Cotação média', '12-48h'],
                    ['Avaliação média', '⭐ 4.7'],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div
                        className="mono text-[9.5px] font-semibold uppercase tracking-[1.2px]"
                        style={{ color: 'var(--text-mute)' }}
                      >
                        {k}
                      </div>
                      <div
                        className="serif font-light leading-none"
                        style={{ fontSize: 18, color: 'var(--text)' }}
                      >
                        {v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active filter chips */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  className="mono text-[10.5px] font-semibold uppercase tracking-[1.2px]"
                  style={{ color: 'var(--text-mute)' }}
                >
                  Filtros:
                </span>
                {['Cor: Bege/Cremes', 'Acabamento: Polido', 'Origem: Brasil', 'Preço: R$ 80–600/m²'].map(
                  (c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold"
                      style={{
                        background: 'var(--brand-soft)',
                        borderColor: 'var(--brand)',
                        color: 'var(--brand)',
                      }}
                    >
                      {c}
                      <button
                        className="inline-flex h-3.5 w-3.5 cursor-pointer items-center justify-center"
                        style={{ background: 'transparent', border: 0, color: 'var(--brand)' }}
                      >
                        <X size={9} />
                      </button>
                    </span>
                  )
                )}
                <button
                  className="cursor-pointer text-[11px] font-semibold hover:underline"
                  style={{ color: 'var(--text-mute)', background: 'transparent', border: 0 }}
                >
                  limpar tudo
                </button>
              </div>

              {/* Toolbar */}
              <div className="mb-4 flex items-center justify-between gap-3 max-[760px]:flex-col max-[760px]:items-stretch">
                <span className="text-[12.5px]" style={{ color: 'var(--text-soft)' }}>
                  <b style={{ color: 'var(--text)' }}>32</b> produtos · ordenado por{' '}
                  <b style={{ color: 'var(--text)' }}>relevância</b>
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Relevância <ChevronDown size={12} />
                  </Button>
                  <ToggleGroup type="single" defaultValue="grid">
                    <ToggleGroupItem value="grid" size="sm">
                      Grade
                    </ToggleGroupItem>
                    <ToggleGroupItem value="list" size="sm">
                      Lista
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>

              {/* Grid · featured + 6 normais */}
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                }}
              >
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    {...p}
                    variant={p.featured ? 'featured' : 'default'}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-5 flex justify-center">
                <div
                  className="inline-flex items-center gap-1 rounded-[10px] border p-1"
                  style={{ background: 'var(--surface-2)', borderColor: 'var(--line-2)' }}
                >
                  {[
                    { label: '‹', kind: 'prev' },
                    { label: '1', active: true },
                    { label: '2' },
                    { label: '3' },
                    { label: '4' },
                    { label: '…', kind: 'gap' },
                    { label: '18' },
                    { label: '›', kind: 'next' },
                  ].map((p, i) => (
                    <button
                      key={i}
                      disabled={p.kind === 'gap'}
                      className="mono inline-flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-[6px] px-2 text-[12px] font-semibold transition-colors"
                      style={{
                        background: p.active ? 'var(--brand)' : 'transparent',
                        color: p.active ? 'var(--bg)' : 'var(--text-soft)',
                        border: 0,
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Optional right rail · sticky cart preview */}
            <aside
              className="border-l p-4 max-[1100px]:hidden"
              style={{ borderColor: 'var(--line-1)', background: 'var(--surface-2)' }}
            >
              <div className="sticky top-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span
                    className="mono text-[10px] font-semibold uppercase tracking-[1.3px]"
                    style={{ color: 'var(--text-mute)' }}
                  >
                    Sacola do projeto
                  </span>
                  <Badge tone="brand">{cartItems.length}</Badge>
                </div>
                <div
                  className="text-[11.5px]"
                  style={{ color: 'var(--text-soft)' }}
                >
                  Vinculada ao projeto <b style={{ color: 'var(--text)' }}>Yachthouse 2104</b>
                </div>
                <div
                  className="serif font-light"
                  style={{ fontSize: 28, color: 'var(--text)', letterSpacing: '-0.025em' }}
                >
                  R${' '}
                  <em className="italic" style={{ color: 'var(--brand)' }}>
                    91.752
                  </em>
                </div>
                <Button className="w-full">
                  <ShoppingCart size={14} /> Ver sacola completa
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </Showcase>

      {/* ======================================================== */}
      {/* B · Lista horizontal                                       */}
      {/* ======================================================== */}
      <SubHead num="B" title="Lista horizontal" italic="comparação rápida · review denso" />
      <Showcase>
        <div className="flex flex-col gap-3">
          {products.slice(0, 3).map((p) => (
            <ProductCard key={p.id} {...p} variant="list" />
          ))}
        </div>
      </Showcase>

      {/* ======================================================== */}
      {/* C · Product detail                                         */}
      {/* ======================================================== */}
      <SubHead num="C" title="Product detail · página completa" italic="gallery + opções + specs + cart" />
      <Showcase padding="none">
        <ProductDetail />
      </Showcase>

      {/* ======================================================== */}
      {/* D · Service cards                                          */}
      {/* ======================================================== */}
      <SubHead num="D" title="Service cards · catálogo de serviços" italic="mão-de-obra · consultoria · vistoria" />
      <Showcase>
        <ServiceCards />
      </Showcase>

      {/* ======================================================== */}
      {/* E · Cart drawer                                            */}
      {/* ======================================================== */}
      <SubHead num="E" title="Cart Drawer · carrinho lateral" italic="itens · variações · qty · subtotal · checkout" />
      <Showcase padding="none">
        <CartDrawer />
      </Showcase>

      {/* ======================================================== */}
      {/* F · Compare                                                 */}
      {/* ======================================================== */}
      <SubHead num="F" title="Compare · 3 produtos lado a lado" italic="atributos alinhados · vencedor por critério" />
      <Showcase padding="none">
        <CompareGrid />
      </Showcase>

      {/* ======================================================== */}
      {/* G · Search omni                                             */}
      {/* ======================================================== */}
      <SubHead num="G" title="Search omni · busca global" italic="produto + categoria + fornecedor + sugestões" />
      <Showcase>
        <SearchOmni />
      </Showcase>
    </div>
  )
}
