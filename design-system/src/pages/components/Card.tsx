import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Card',
  import: "import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'",
  contexto:
    'Container universal · 3 variantes: default (estático), hover (lift on hover · clicável), selected (ring brand). Use accent prop para indicar squad/severidade com border-left colorida.',
  quandoUsar: [
    'Container de qualquer bloco · projeto, cliente, kpi, observação',
    'variant="hover" quando o card todo navega (use dentro de <Link>)',
    'variant="selected" para item ativo numa lista',
    'accent para classificar visualmente (squad, status)',
  ],
  props: [
    { name: 'variant', type: '"default" | "hover" | "selected"', description: 'Interação' },
    { name: 'accent', type: '"brand" | "purple" | "pink" | ... semantic', description: 'Border-left 3px' },
  ],
  antiPatterns: [
    'Card dentro de Card · respeito ao ritmo',
    'Sombra customizada · use --shadow-1...4',
  ],
  exemplo: `<Card variant="hover" accent="brand">
  <CardHeader>
    <CardTitle>Yachthouse 2104</CardTitle>
    <Badge tone="danger">Atrasado</Badge>
  </CardHeader>
  <CardContent>
    Apartamento 280 m² em obra · entrega 15/06.
  </CardContent>
  <CardFooter>
    <span className="mono">#2410</span>
    <Badge tone="purple">Orion</Badge>
  </CardFooter>
</Card>`,
  relacionados: ['DetailHero', 'RichList'],
}

export function CardPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="11.1"
        category="Data Display · Card"
        title="Card"
        italic="container universal"
        description="Default + hover (clicável) + selected. Use accent para classificar com border-left colorida."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Content card" italic="projeto em obra" />
      <Showcase>
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Yachthouse 2104</CardTitle>
              <CardDescription>Família Andrade · BC/SC</CardDescription>
            </div>
            <Badge tone="danger">Atrasado</Badge>
          </CardHeader>
          <CardContent>
            Apartamento 280 m² em obra · entrega prev. 15/06. Atraso de 8 dias na entrega do granito São Gabriel.
          </CardContent>
          <CardFooter>
            <span className="mono text-[10.5px]" style={{ color: 'var(--text-mute)' }}>#2410 rev.0</span>
            <Badge tone="purple">Orion</Badge>
          </CardFooter>
        </Card>
      </Showcase>

      <SubHead num="B" title="Actionable" italic="hover lift + brand border" />
      <Showcase>
        <Card variant="hover" accent="brand">
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <Avatar size="md" square style={{ background: 'var(--purple)' }}>
                <AvatarFallback>TI</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Cobertura Titanium · 101</CardTitle>
                <CardDescription>Ultra Luxo · 920 m²</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            Projeto signature da WS Group em Balneário Camboriú. R$ 9,5M · margem 36%.
          </CardContent>
        </Card>
      </Showcase>
    </div>
  )
}
