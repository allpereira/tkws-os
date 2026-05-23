import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Badge } from '@/components/ui/badge'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'NavigationMenu',
  import: "import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from '@/components/ui/navigation-menu'",
  contexto:
    'Mega menu de marketing (landing page, portal externo). Use para nav primária com múltiplas seções e preview rico. Para app interno densey, use Sidebar.',
  quandoUsar: [
    'Portal externo / landing page TKWS',
    'Nav primária do app com 4-8 seções de alto nível',
    'Mega menu com cards de feature por seção',
  ],
  props: [
    { name: 'orientation', type: '"horizontal" | "vertical"', description: 'Default horizontal' },
  ],
  antiPatterns: [
    'NavigationMenu para nav densa de app · use Sidebar',
    'Mega menu sem ícone/preview · perde a vantagem visual',
  ],
  exemplo: `<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Produto</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid gap-3 p-4 md:w-[480px] md:grid-cols-2">
          <li>
            <NavigationMenuLink className="block p-3 rounded-lg hover:bg-[var(--surface-3)]">
              <div className="font-bold">Projetos</div>
              <p className="text-[12px]">Gestão completa do portfólio</p>
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`,
  relacionados: ['Sidebar', 'Menubar'],
}

const features = [
  { title: 'Projetos', desc: 'Gestão completa do portfólio · da captação à entrega', badge: 'Core' as const },
  { title: 'Catálogo de produtos', desc: 'Curadoria editorial · fornecedores selecionados' },
  { title: 'Briefings', desc: 'Editor rich text · co-autoria cliente · referências' },
  { title: 'Planta & Spec', desc: 'Anotações sobre plantas · spec por ambiente' },
]

const integrations = [
  { title: 'Plugin SketchUp', desc: 'Anotações sobre modelos · spec automatizado' },
  { title: 'Portal de fornecedores', desc: 'Cotações em tempo real · ETA da entrega' },
  { title: 'AI · Lúmen', desc: 'Assistente para briefing, orçamento e cronograma', badge: 'Beta' as const },
]

export function NavigationMenuPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="08.6"
        category="Navigation · Navigation Menu"
        title="Navigation Menu"
        italic="mega menu"
        description="Nav primária com preview rico. Use em landing/portal. Para app denso, Sidebar."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Mega menu com 2 seções" />
      <Showcase>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Produto</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[500px] gap-2 p-3 md:grid-cols-2">
                  {features.map((f) => (
                    <li key={f.title}>
                      <NavigationMenuLink className="block cursor-pointer rounded-lg p-3 transition-colors hover:bg-[var(--surface-3)]">
                        <div className="flex items-center gap-2">
                          <span className="text-[13.5px] font-bold" style={{ color: 'var(--text)' }}>
                            {f.title}
                          </span>
                          {f.badge && <Badge tone="brand">{f.badge}</Badge>}
                        </div>
                        <div className="mt-1 text-[12px]" style={{ color: 'var(--text-soft)' }}>
                          {f.desc}
                        </div>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Integrações</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[440px] gap-2 p-3">
                  {integrations.map((f) => (
                    <li key={f.title}>
                      <NavigationMenuLink className="block cursor-pointer rounded-lg p-3 transition-colors hover:bg-[var(--surface-3)]">
                        <div className="flex items-center gap-2">
                          <span className="text-[13.5px] font-bold" style={{ color: 'var(--text)' }}>
                            {f.title}
                          </span>
                          {f.badge && <Badge tone="warning">{f.badge}</Badge>}
                        </div>
                        <div className="mt-1 text-[12px]" style={{ color: 'var(--text-soft)' }}>
                          {f.desc}
                        </div>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className="cursor-pointer rounded-md px-3 py-2 text-[13px] font-semibold transition-colors hover:bg-[var(--surface-3)]"
                style={{ color: 'var(--text-soft)' }}
              >
                Pricing
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className="cursor-pointer rounded-md px-3 py-2 text-[13px] font-semibold transition-colors hover:bg-[var(--surface-3)]"
                style={{ color: 'var(--text-soft)' }}
              >
                Docs
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Showcase>
    </div>
  )
}
