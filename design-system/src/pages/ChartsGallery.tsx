import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import {
  Sparkline,
  Gauge,
  Waterfall,
  Treemap,
  RadarChart,
  BulletChart,
  StackedBarChart,
  GroupedBarChart,
  CalendarHeatmap,
  Burndown,
  ScatterPlot,
  PolarArea,
  RangeBar,
  FunnelChart,
} from '@/components/tkws/charts-gallery'
import { Donut, VerticalBar, LineSeriesChart, Heatmap } from '@/components/tkws/charts'
import { Card, CardContent } from '@/components/ui/card'

// Gera dados estáticos para a demo
const seedData = (n: number, base: number, variance: number): number[] =>
  Array.from({ length: n }, (_, i) => Math.max(0, base + Math.sin(i / 2) * variance + Math.cos(i / 1.3) * variance * 0.7))

const calendarData = Array.from({ length: 52 * 7 }, (_, i) => {
  // simula contributions · zeros nos fins de semana, picos no meio
  const day = i % 7
  if (day === 0 || day === 6) return Math.random() > 0.85 ? 30 : 0
  const week = Math.floor(i / 7)
  const seasonality = 50 + Math.sin(week / 8) * 40
  return Math.max(0, seasonality + Math.random() * 30 - 15)
})

export function ChartsGalleryPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        num="13.0"
        category="Charts · Galeria"
        title="Charts Gallery"
        italic="14 modelos · SVG editorial · zero recharts"
        description="Família ampla de gráficos sem dependência externa. Sparklines, gauges, waterfall, treemap, radar, bullet, stacked/grouped bars, calendar heatmap, burndown, scatter, polar, range, funnel."
        tag="14 modelos"
      />

      {/* ============== KPIs com Sparklines ============== */}
      <SubHead num="A" title="Sparklines · mini charts inline em KPIs" italic="line · area · bars" />
      <Showcase>
        <div className="grid grid-cols-2 gap-4 max-[760px]:grid-cols-1 md:grid-cols-4">
          {[
            { label: 'Receita do mês', value: 'R$ 87,4M', delta: '+18%', tone: 'success' as const, variant: 'line' as const },
            { label: 'Margem média', value: '31,2%', delta: '+0,8pp', tone: 'success' as const, variant: 'area' as const },
            { label: 'Atrasos', value: '3 obras', delta: '+1', tone: 'danger' as const, variant: 'bars' as const },
            { label: 'CSAT', value: '4,8 ⭐', delta: '+0,2', tone: 'brand' as const, variant: 'line' as const },
          ].map((k) => (
            <Card key={k.label}>
              <CardContent>
                <div className="mono text-[10px] font-semibold uppercase tracking-[1.2px]" style={{ color: 'var(--text-mute)' }}>
                  {k.label}
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="serif font-light" style={{ fontSize: 28, color: 'var(--text)', letterSpacing: '-0.025em', lineHeight: 1 }}>
                    {k.value}
                  </span>
                  <span className="mono text-[11px] font-bold" style={{ color: `var(--${k.tone})` }}>
                    {k.delta}
                  </span>
                </div>
                <div className="mt-3">
                  <Sparkline data={seedData(12, 50, 22)} tone={k.tone} variant={k.variant} width={180} height={36} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Showcase>

      {/* ============== Gauges ============== */}
      <SubHead num="B" title="Gauges · medidor semicircular" italic="auto tone por faixa · 0-33 danger / 33-66 warning / 66+ success" />
      <Showcase>
        <div className="flex flex-wrap justify-around gap-6">
          <Gauge value={28} label="Velocity Sprint 12" hint="22 / 80 pts" />
          <Gauge value={64} label="Cobertura Specs" hint="64 dos 100" />
          <Gauge value={92} label="On time delivery" hint="92% últimos 90d" />
          <Gauge value={47} tone="brand" label="Saturação obras" hint="meta 60%" />
        </div>
      </Showcase>

      {/* ============== Waterfall ============== */}
      <SubHead num="C" title="Waterfall · receita → margem real" italic="entradas e saídas cumulativas" />
      <Showcase>
        <Waterfall
          bars={[
            { label: 'Receita', value: 8740, type: 'start' },
            { label: 'Mat.', value: -3260, type: 'negative' },
            { label: 'M.O.', value: -1850, type: 'negative' },
            { label: 'Logística', value: -420, type: 'negative' },
            { label: 'Imposto', value: -680, type: 'negative' },
            { label: 'Margem', value: 2530, type: 'end' },
          ]}
        />
      </Showcase>

      {/* ============== Treemap ============== */}
      <SubHead num="D" title="Treemap · distribuição por ambiente" italic="proporção visual · área = valor" />
      <Showcase>
        <Treemap
          cells={[
            { label: 'Cozinha', value: 142, tone: 'brand' },
            { label: 'Living', value: 84, tone: 'purple' },
            { label: 'Master', value: 96, tone: 'pink' },
            { label: 'BWC master', value: 38, tone: 'warning' },
            { label: 'Suite 1', value: 28, tone: 'success' },
            { label: 'BWC suite 1', value: 14, tone: 'alert' },
            { label: 'Lavabo', value: 9, tone: 'danger' },
          ]}
        />
      </Showcase>

      {/* ============== Radar ============== */}
      <SubHead num="E" title="Radar · spider chart multi-eixo" italic="atual vs benchmark (dashed)" />
      <Showcase>
        <div className="flex flex-wrap items-center justify-center gap-12">
          <RadarChart
            axes={[
              { label: 'Prazo', value: 78, compare: 65 },
              { label: 'Margem', value: 82, compare: 75 },
              { label: 'CSAT', value: 92, compare: 80 },
              { label: 'Qualidade', value: 68, compare: 80 },
              { label: 'Inovação', value: 60, compare: 50 },
              { label: 'Custo', value: 85, compare: 70 },
            ]}
          />
          <div className="max-w-[260px]">
            <h5 className="serif text-[17px] font-normal" style={{ color: 'var(--text)' }}>
              Squad Orion · Q2
            </h5>
            <p className="mt-2 text-[12.5px] leading-[1.55]" style={{ color: 'var(--text-soft)' }}>
              Performance multi-dimensional vs benchmark do estúdio (linha pontilhada). Orion sobressai em CSAT e custo;
              gap em qualidade vs meta.
            </p>
            <div className="mono mt-3 text-[10.5px]" style={{ color: 'var(--text-mute)' }}>
              <span className="inline-block h-2 w-3 rounded-sm align-middle" style={{ background: 'var(--brand)' }} /> Orion atual
              <br />
              <span className="inline-block h-px w-3 align-middle" style={{ background: 'var(--text-mute)' }} /> Benchmark estúdio
            </div>
          </div>
        </div>
      </Showcase>

      {/* ============== Bullet Charts ============== */}
      <SubHead num="F" title="Bullet Charts · KPI atual vs meta + faixas" italic="condensed performance view" />
      <Showcase>
        <div className="flex flex-col gap-5">
          <BulletChart label="Receita Q2" actual={87} target={92} max={120} unit="M" />
          <BulletChart label="Margem média" actual={32} target={30} max={45} unit="%" />
          <BulletChart label="Obras entregues" actual={11} target={14} max={20} />
          <BulletChart label="NPS clientes" actual={71} target={60} max={100} />
        </div>
      </Showcase>

      {/* ============== Stacked + Grouped Bars ============== */}
      <SubHead num="G" title="Stacked + Grouped Bars" italic="composição vs comparação" />
      <div className="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
        <Showcase>
          <h5 className="serif mb-3 text-[15px] font-normal" style={{ color: 'var(--text)' }}>
            Stacked · receita por squad/mês
          </h5>
          <StackedBarChart
            labels={['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']}
            series={[
              { name: 'Orion', tone: 'brand', values: [22, 28, 25, 30, 35, 38] },
              { name: 'Vega', tone: 'purple', values: [15, 18, 14, 20, 22, 24] },
              { name: 'Apollo', tone: 'success', values: [10, 12, 14, 13, 16, 18] },
            ]}
            width={420}
          />
        </Showcase>
        <Showcase>
          <h5 className="serif mb-3 text-[15px] font-normal" style={{ color: 'var(--text)' }}>
            Grouped · contratos × cotações por mês
          </h5>
          <GroupedBarChart
            labels={['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']}
            series={[
              { name: 'Cotações', tone: 'pink', values: [18, 22, 19, 28, 32, 28] },
              { name: 'Contratos', tone: 'brand', values: [8, 10, 9, 14, 18, 16] },
            ]}
            width={420}
          />
        </Showcase>
      </div>

      {/* ============== Calendar Heatmap ============== */}
      <SubHead num="H" title="Calendar Heatmap · ano inteiro" italic="estilo GitHub contributions" />
      <Showcase>
        <CalendarHeatmap values={calendarData} tone="brand" />
      </Showcase>

      {/* ============== Burndown ============== */}
      <SubHead num="I" title="Burndown · ideal vs atual" italic="cronograma de sprint ou obra" />
      <Showcase>
        <Burndown
          actual={[80, 75, 72, 68, 64, 60, 58, 52, 50, 42, 38, 34, 28, 22]}
          ideal={[80, 74, 68, 62, 56, 50, 44, 38, 32, 26, 20, 14, 8, 0]}
          labels={['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12', 'S13', 'S14']}
        />
      </Showcase>

      {/* ============== Scatter Plot ============== */}
      <SubHead num="J" title="Scatter · correlação valor × margem" italic="pontos com tone e size variáveis" />
      <Showcase>
        <ScatterPlot
          xLabel="Valor (R$ M)"
          yLabel="Margem %"
          points={[
            { x: 1.2, y: 28, label: 'Reserva', tone: 'warning', size: 8 },
            { x: 2.4, y: 32, label: 'Yachthouse', tone: 'brand', size: 10 },
            { x: 3.98, y: 31, label: 'Vitra', tone: 'success', size: 12 },
            { x: 9.5, y: 36, label: 'Titanium', tone: 'purple', size: 14 },
            { x: 1.86, y: 33, label: 'Castro', tone: 'pink', size: 9 },
            { x: 1.24, y: 31, label: 'Lumini', tone: 'brand', size: 8 },
            { x: 0.64, y: 29, label: 'Loft', tone: 'warning', size: 6 },
            { x: 0.48, y: 36, label: 'Flat', tone: 'success', size: 6 },
          ]}
        />
      </Showcase>

      {/* ============== Polar Area ============== */}
      <SubHead num="K" title="Polar Area · pizza com raios variáveis" italic="alternativa visual ao donut" />
      <Showcase>
        <div className="flex flex-wrap items-center justify-center gap-12">
          <PolarArea
            slices={[
              { label: 'Cozinha', value: 142, tone: 'brand' },
              { label: 'Living', value: 84, tone: 'purple' },
              { label: 'Master', value: 96, tone: 'pink' },
              { label: 'BWC', value: 38, tone: 'warning' },
              { label: 'Lavabo', value: 12, tone: 'success' },
              { label: 'Suite', value: 28, tone: 'alert' },
            ]}
          />
          <div className="max-w-[260px]">
            <h5 className="serif text-[17px] font-normal" style={{ color: 'var(--text)' }}>
              Distribuição de m²
            </h5>
            <p className="mt-2 text-[12.5px] leading-[1.55]" style={{ color: 'var(--text-soft)' }}>
              Polar area destaca diferenças relativas mais que pie chart · raios variáveis enfatizam o "vencedor".
            </p>
          </div>
        </div>
      </Showcase>

      {/* ============== Range Bars ============== */}
      <SubHead num="L" title="Range Bars · valor dentro de banda" italic="aceitável vs fora · com posição atual" />
      <Showcase>
        <div className="flex max-w-2xl flex-col gap-4">
          <RangeBar label="Margem alvo" min={28} max={38} current={32} unit="%" />
          <RangeBar label="Atraso médio" min={0} max={5} current={3} unit="d" />
          <RangeBar label="CSAT" min={4.0} max={5.0} current={4.8} unit="" />
          <RangeBar label="Custo por m²" min={3200} max={4800} current={3680} unit="" />
        </div>
      </Showcase>

      {/* ============== Funnel Chart ============== */}
      <SubHead num="M" title="Funnel · etapas com conversão" italic="leads → contratos · CRM" />
      <Showcase>
        <div className="flex justify-center">
          <FunnelChart
            steps={[
              { label: 'Leads totais', value: 480, tone: 'brand' },
              { label: 'Qualificados', value: 280, tone: 'purple' },
              { label: 'Briefing feito', value: 142, tone: 'pink' },
              { label: 'Orçamento enviado', value: 86, tone: 'warning' },
              { label: 'Contratos assinados', value: 34, tone: 'success' },
            ]}
          />
        </div>
      </Showcase>

      {/* ============== Donut + Bar + Line + Heatmap (existentes) ============== */}
      <SubHead num="N" title="Família existente · donut, bar, line, heatmap" italic="recharts via wrapper TKWS" />
      <div className="grid grid-cols-2 gap-4 max-[760px]:grid-cols-1">
        <Showcase>
          <h5 className="serif mb-3 text-[15px] font-normal" style={{ color: 'var(--text)' }}>
            Donut · receita por região
          </h5>
          <Donut
            data={[
              { name: 'SC', value: 38, color: 'var(--brand)' },
              { name: 'SP', value: 28, color: 'var(--purple)' },
              { name: 'PR', value: 18, color: 'var(--success)' },
              { name: 'RJ', value: 10, color: 'var(--warning)' },
              { name: 'Outros', value: 6, color: 'var(--pink)' },
            ]}
          />
        </Showcase>
        <Showcase>
          <h5 className="serif mb-3 text-[15px] font-normal" style={{ color: 'var(--text)' }}>
            Vertical Bar · entregas/mês
          </h5>
          <VerticalBar
            data={[
              { label: 'Jan', value: 4 },
              { label: 'Fev', value: 6 },
              { label: 'Mar', value: 5 },
              { label: 'Abr', value: 8 },
              { label: 'Mai', value: 11 },
              { label: 'Jun', value: 9 },
            ]}
          />
        </Showcase>
        <Showcase>
          <h5 className="serif mb-3 text-[15px] font-normal" style={{ color: 'var(--text)' }}>
            Line · receita anualizada
          </h5>
          <LineSeriesChart
            data={[
              { label: 'Jan', Receita: 22, Margem: 6 },
              { label: 'Fev', Receita: 28, Margem: 8 },
              { label: 'Mar', Receita: 25, Margem: 7 },
              { label: 'Abr', Receita: 30, Margem: 10 },
              { label: 'Mai', Receita: 35, Margem: 11 },
              { label: 'Jun', Receita: 38, Margem: 12 },
              { label: 'Jul', Receita: 36, Margem: 11 },
              { label: 'Ago', Receita: 42, Margem: 13 },
              { label: 'Set', Receita: 40, Margem: 14 },
              { label: 'Out', Receita: 46, Margem: 15 },
              { label: 'Nov', Receita: 50, Margem: 16 },
              { label: 'Dez', Receita: 52, Margem: 18 },
            ]}
            series={[
              { name: 'Receita', color: 'var(--brand)' },
              { name: 'Margem', color: 'var(--success)' },
            ]}
          />
        </Showcase>
        <Showcase>
          <h5 className="serif mb-3 text-[15px] font-normal" style={{ color: 'var(--text)' }}>
            Heatmap · presença squad/dia
          </h5>
          <Heatmap
            rows={5}
            cols={5}
            labelsY={['Loiana', 'Ana', 'João', 'Rafael', 'Pedro']}
            labelsX={['Seg', 'Ter', 'Qua', 'Qui', 'Sex']}
            data={[
              [0.8, 0.65, 0.9, 1.0, 0.7],
              [0.6, 0.8, 0.85, 0.9, 0.8],
              [0.4, 0.6, 1.0, 0.85, 0.5],
              [0.9, 1.0, 0.8, 0.65, 0.75],
              [0.7, 0.75, 0.6, 0.85, 0.95],
            ]}
          />
        </Showcase>
      </div>
    </div>
  )
}
