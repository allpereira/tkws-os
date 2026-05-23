import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Tabs',
  import: "import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'",
  contexto:
    'Tabs Radix · 2 variantes: pill (view switcher: Dashboard/Kanban/Lista) e underline (abas de detalhe). Use no máximo 7 abas. Tab atual é state da URL via TanStack Router (search params).',
  quandoUsar: [
    'Pill: alternar entre VISÕES do mesmo dado (Kanban vs Lista vs Tabela)',
    'Underline: navegação interna em uma tela de detalhe (Visão Geral · Documentos · Orçamentos)',
    'Mais de 7 abas? Vire sidebar nav',
  ],
  props: [
    { name: 'defaultValue / value', type: 'string', description: 'Aba ativa' },
    { name: 'variant (TabsList)', type: '"pill" | "underline"', description: 'Estilo visual' },
    { name: 'orientation', type: '"horizontal" | "vertical"', description: 'Padrão horizontal' },
  ],
  antiPatterns: [
    '8+ tabs — sidebar é melhor',
    'Tab ativa não refletida na URL — saved views quebram',
    'Conteúdo de tab que muda tela inteira — vire rota',
  ],
  exemplo: `<Tabs defaultValue="overview">
  <TabsList variant="underline">
    <TabsTrigger value="overview" underline>Visão Geral</TabsTrigger>
    <TabsTrigger value="docs" underline>Documentos</TabsTrigger>
    <TabsTrigger value="budget" underline>Orçamentos</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Conteúdo…</TabsContent>
</Tabs>`,
  relacionados: ['ToggleGroup', 'Sidebar'],
}

export function TabsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="08.1"
        category="Navigation · Tabs"
        title="Tabs"
        italic="pill · underline"
        description="2 variantes. Pill para visões mutuamente exclusivas. Underline para sub-navegação dentro de uma tela."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Pill · view switcher" />
      <Showcase
        title="Dashboard / Kanban / Lista — mesma data, visões diferentes"
        code={`<Tabs defaultValue="dashboard">
  <TabsList variant="pill">
    <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
    <TabsTrigger value="kanban">Kanban</TabsTrigger>
    <TabsTrigger value="list">Lista</TabsTrigger>
  </TabsList>
</Tabs>`}
      >
        <Tabs defaultValue="dashboard">
          <TabsList variant="pill">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="list">Lista</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="text-[13px]" style={{ color: 'var(--text-soft)' }}>
            <p>Visão consolidada · KPIs + gráficos.</p>
          </TabsContent>
          <TabsContent value="kanban" className="text-[13px]" style={{ color: 'var(--text-soft)' }}>
            <p>Quadro Kanban dos projetos por status.</p>
          </TabsContent>
          <TabsContent value="list" className="text-[13px]" style={{ color: 'var(--text-soft)' }}>
            <p>Lista densa para operação · Rich List.</p>
          </TabsContent>
        </Tabs>
      </Showcase>

      <SubHead num="B" title="Underline · detalhe do projeto" />
      <Showcase>
        <Tabs defaultValue="overview">
          <TabsList variant="underline">
            <TabsTrigger value="overview" underline>Visão Geral</TabsTrigger>
            <TabsTrigger value="data" underline>Dados</TabsTrigger>
            <TabsTrigger value="docs" underline>Documentos</TabsTrigger>
            <TabsTrigger value="budget" underline>Orçamentos</TabsTrigger>
            <TabsTrigger value="finance" underline>Financeiro</TabsTrigger>
            <TabsTrigger value="obra" underline>Obra</TabsTrigger>
            <TabsTrigger value="team" underline>Equipe</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="text-[13px]" style={{ color: 'var(--text-soft)' }}>
            <p>Resumo do projeto com KPIs principais e atividade recente.</p>
          </TabsContent>
        </Tabs>
      </Showcase>
    </div>
  )
}
