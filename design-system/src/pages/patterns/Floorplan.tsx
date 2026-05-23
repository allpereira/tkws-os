import { Edit3, MapPin, MessageSquare } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'
import type { AIPrompt } from '@/lib/prompts'

const ambientes = [
  { id: 'living', name: 'Living', area: 64, percent: 23, items: 18, color: 'var(--brand)' },
  { id: 'kitchen', name: 'Cozinha', area: 28, percent: 10, items: 12, color: 'var(--warning)' },
  { id: 'master', name: 'Master', area: 32, percent: 12, items: 9, color: 'var(--purple)' },
  { id: 'sui1', name: 'Suíte 1', area: 26, percent: 9, items: 7, color: 'var(--pink)' },
  { id: 'sui2', name: 'Suíte 2', area: 26, percent: 9, items: 7, color: 'var(--success)' },
  { id: 'bwc1', name: 'BWC Master', area: 14, percent: 5, items: 6, color: 'var(--alert)' },
  { id: 'bwc2', name: 'BWC Social', area: 8, percent: 3, items: 4, color: 'var(--danger)' },
  { id: 'office', name: 'Escritório', area: 18, percent: 6, items: 5, color: 'var(--text-mute)' },
  { id: 'terrace', name: 'Terraço', area: 64, percent: 23, items: 11, color: 'var(--text-soft)' },
]

const specs = [
  { ambiente: 'Cozinha', item: 'Bancada', spec: 'Quartzito Imperial · Marmoraria SG · 8 m²', valor: 67_200 },
  { ambiente: 'Cozinha', item: 'Cuba', spec: 'Cuba esculpida Travertino · Atelier Stone', valor: 3_400 },
  { ambiente: 'Cozinha', item: 'Marcenaria', spec: 'Forn. Sereno · MDF laqueado preto · acabamento Naval', valor: 42_800 },
  { ambiente: 'Living', item: 'Piso', spec: 'Madeira Freijó · 64 m² · paginação espinha de peixe', valor: 38_400 },
  { ambiente: 'Master', item: 'Iluminação', spec: 'Lúmen · 3 arandelas cônicas + 1 trilho LED', valor: 8_400 },
]

const prompt: AIPrompt = {
  componente: 'Pattern · Floorplan & Spec',
  import: '// Composição: SVG planta com marcadores + ambiente list + spec table',
  contexto:
    'Tela de planta baixa com anotações por ambiente + lista de specs (granito, marcenaria, iluminação). Cada ambiente clicável filtra specs. Vincula a render via Lightbox. Use sempre em projetos de decoração/reforma · não em conceito.',
  quandoUsar: [
    'Aba "Planta" do detalhe de projeto',
    'Apresentação de spec por ambiente para cliente',
    'Cotação por ambiente com fornecedores',
  ],
  props: [],
  antiPatterns: [
    'Planta sem cor por ambiente · perde leitura',
    'Specs sem fornecedor · vira lista de wishes',
    'SVG sem viewBox responsivo · quebra em mobile',
  ],
  exemplo: `// SVG da planta com <rect> por ambiente
// Click em rect → filtra spec table
// Cada ambiente tem cor + área + % do total + count de items`,
  relacionados: ['Lightbox', 'Table', 'DataTable'],
}

export function FloorplanPattern() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        num="P32"
        category="Pattern · Floorplan & Spec"
        title="Planta & Spec"
        italic="ambientes · especificação"
        description="Planta baixa com cor por ambiente + spec table por categoria. Click em ambiente filtra specs."
        tag="tela completa"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Yachthouse 2104 · 280 m²" />
      <Showcase padding="none">
        <div className="grid grid-cols-[1fr_360px] gap-0 max-[900px]:grid-cols-1">
          {/* Planta SVG */}
          <div
            className="flex aspect-[16/10] items-center justify-center p-8"
            style={{
              background: 'linear-gradient(135deg, var(--surface-3) 0%, var(--surface-4) 60%, var(--brand-soft) 100%)',
            }}
          >
            <svg viewBox="0 0 600 380" className="h-full w-full max-w-2xl">
              {/* Living */}
              <rect x="20" y="20" width="200" height="180" fill="var(--brand)" fillOpacity={0.18} stroke="var(--brand)" strokeWidth="1.5" />
              <text x="120" y="105" textAnchor="middle" fill="var(--text)" fontFamily="Fraunces" fontSize="14">Living</text>
              <text x="120" y="125" textAnchor="middle" fill="var(--text-mute)" fontSize="10" fontFamily="JetBrains Mono">64 m²</text>

              {/* Cozinha */}
              <rect x="20" y="210" width="120" height="90" fill="var(--warning)" fillOpacity={0.18} stroke="var(--warning)" strokeWidth="1.5" />
              <text x="80" y="255" textAnchor="middle" fill="var(--text)" fontFamily="Fraunces" fontSize="12">Cozinha</text>
              <text x="80" y="272" textAnchor="middle" fill="var(--text-mute)" fontSize="9" fontFamily="JetBrains Mono">28 m²</text>

              {/* Office */}
              <rect x="150" y="210" width="70" height="90" fill="var(--text-mute)" fillOpacity={0.18} stroke="var(--text-mute)" strokeWidth="1.5" />
              <text x="185" y="252" textAnchor="middle" fill="var(--text)" fontFamily="Fraunces" fontSize="11">Office</text>
              <text x="185" y="268" textAnchor="middle" fill="var(--text-mute)" fontSize="9" fontFamily="JetBrains Mono">18 m²</text>

              {/* Master */}
              <rect x="230" y="20" width="160" height="120" fill="var(--purple)" fillOpacity={0.18} stroke="var(--purple)" strokeWidth="1.5" />
              <text x="310" y="75" textAnchor="middle" fill="var(--text)" fontFamily="Fraunces" fontSize="14">Master</text>
              <text x="310" y="93" textAnchor="middle" fill="var(--text-mute)" fontSize="10" fontFamily="JetBrains Mono">32 m²</text>

              {/* BWC Master */}
              <rect x="230" y="150" width="70" height="60" fill="var(--alert)" fillOpacity={0.18} stroke="var(--alert)" strokeWidth="1.5" />
              <text x="265" y="180" textAnchor="middle" fill="var(--text)" fontFamily="Fraunces" fontSize="9">BWC M.</text>
              <text x="265" y="195" textAnchor="middle" fill="var(--text-mute)" fontSize="8" fontFamily="JetBrains Mono">14 m²</text>

              {/* Suítes */}
              <rect x="310" y="150" width="80" height="60" fill="var(--pink)" fillOpacity={0.18} stroke="var(--pink)" strokeWidth="1.5" />
              <text x="350" y="180" textAnchor="middle" fill="var(--text)" fontFamily="Fraunces" fontSize="10">Suíte 1</text>
              <text x="350" y="195" textAnchor="middle" fill="var(--text-mute)" fontSize="8" fontFamily="JetBrains Mono">26 m²</text>

              <rect x="230" y="220" width="160" height="80" fill="var(--success)" fillOpacity={0.18} stroke="var(--success)" strokeWidth="1.5" />
              <text x="310" y="255" textAnchor="middle" fill="var(--text)" fontFamily="Fraunces" fontSize="11">Suíte 2</text>
              <text x="310" y="272" textAnchor="middle" fill="var(--text-mute)" fontSize="9" fontFamily="JetBrains Mono">26 m²</text>

              {/* BWC Social */}
              <rect x="400" y="150" width="50" height="60" fill="var(--danger)" fillOpacity={0.18} stroke="var(--danger)" strokeWidth="1.5" />
              <text x="425" y="180" textAnchor="middle" fill="var(--text)" fontFamily="Fraunces" fontSize="8">BWC</text>

              {/* Terraço */}
              <rect x="460" y="20" width="120" height="290" fill="var(--text-soft)" fillOpacity={0.12} stroke="var(--text-soft)" strokeWidth="1.5" strokeDasharray="4,2" />
              <text x="520" y="160" textAnchor="middle" fill="var(--text)" fontFamily="Fraunces" fontSize="14">Terraço</text>
              <text x="520" y="180" textAnchor="middle" fill="var(--text-mute)" fontSize="10" fontFamily="JetBrains Mono">64 m²</text>

              {/* Annotations */}
              <circle cx="120" cy="60" r="10" fill="var(--brand)" />
              <text x="120" y="64" textAnchor="middle" fill="var(--bg)" fontSize="10" fontWeight="bold">1</text>
              <circle cx="80" cy="240" r="10" fill="var(--warning)" />
              <text x="80" y="244" textAnchor="middle" fill="var(--bg)" fontSize="10" fontWeight="bold">2</text>
              <circle cx="310" cy="60" r="10" fill="var(--purple)" />
              <text x="310" y="64" textAnchor="middle" fill="var(--bg)" fontSize="10" fontWeight="bold">3</text>
            </svg>
          </div>

          {/* Ambientes sidebar */}
          <aside
            className="border-l p-5 max-[900px]:border-l-0 max-[900px]:border-t"
            style={{ borderColor: 'var(--line-1)' }}
          >
            <div className="flex items-center justify-between">
              <span className="mono text-[10.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                Ambientes · {ambientes.length}
              </span>
              <Button variant="outline" size="sm"><Edit3 size={11} /> Editar planta</Button>
            </div>
            <ul className="mt-3 flex flex-col gap-1.5">
              {ambientes.map((a) => (
                <li
                  key={a.id}
                  className="grid cursor-pointer grid-cols-[6px_1fr_auto] items-center gap-3 rounded-md p-2 transition-colors hover:bg-white/[0.04]"
                  style={{ background: 'var(--surface-2)' }}
                >
                  <span className="h-5 w-1 rounded-full" style={{ background: a.color }} />
                  <div>
                    <div className="text-[12.5px] font-semibold" style={{ color: 'var(--text)' }}>
                      {a.name}
                    </div>
                    <div className="mono text-[10px]" style={{ color: 'var(--text-mute)' }}>
                      {a.area} m² · {a.percent}% · {a.items} items
                    </div>
                  </div>
                  <MessageSquare size={11} style={{ color: 'var(--text-mute)' }} />
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </Showcase>

      <SubHead num="B" title="Spec por ambiente" />
      <Showcase padding="none">
        <Card>
          <CardHeader>
            <CardTitle>Especificações · 5 items destacados</CardTitle>
            <Badge tone="brand">Ver tudo · 69 items</Badge>
          </CardHeader>
          <CardContent className="!p-0">
            <Table>
              <TableBody>
                {specs.map((s, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Badge tone="purple">{s.ambiente}</Badge>
                    </TableCell>
                    <TableCell style={{ color: 'var(--text)' }}>
                      <div className="font-semibold">{s.item}</div>
                      <div className="mono text-[10.5px]" style={{ color: 'var(--text-mute)' }}>
                        {s.spec}
                      </div>
                    </TableCell>
                    <TableCell className="num-tabular text-right font-bold" style={{ color: 'var(--text)' }}>
                      {formatCurrency(s.valor)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        <MapPin size={11} /> Ver na planta
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Showcase>
    </div>
  )
}
