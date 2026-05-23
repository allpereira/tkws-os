import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage as BreadcrumbCurrent,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Breadcrumb',
  import: "import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'",
  contexto:
    'Breadcrumb mostra o caminho atual em hierarquias profundas (Projetos → Squad → Detalhe). Use mono uppercase TKWS. Último item é a página atual (BreadcrumbPage), os anteriores são links.',
  quandoUsar: [
    'Hierarquia ≥ 2 níveis em telas de detalhe',
    'Onde a navegação por sidebar não basta para mostrar contexto',
  ],
  props: [],
  antiPatterns: [
    'Breadcrumb em telas de 1 nível (Home → X)',
    'Breadcrumb redundante quando há header com título igual',
    'Usar > em vez de Chevron · vire ChevronRight de lucide',
  ],
  exemplo: `<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink asChild>
        <Link to="/projetos">Projetos</Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink asChild>
        <Link to="/projetos?squad=orion">Squad Orion</Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>#2410 Yachthouse</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`,
  relacionados: ['Header', 'TabsList'],
}

export function BreadcrumbPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="08.3"
        category="Navigation · Breadcrumb"
        title="Breadcrumb"
        italic="caminho contextual"
        description="JetBrains Mono uppercase. Último item é a página atual. Use Link do TanStack Router via asChild."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Padrão" />
      <Showcase>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/projetos">Projetos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/projetos?squad=orion">Squad Orion</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbCurrent>#2410 Yachthouse</BreadcrumbCurrent>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Showcase>
    </div>
  )
}
