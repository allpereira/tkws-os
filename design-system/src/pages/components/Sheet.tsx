import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input, Field } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Sheet',
  import: "import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet'",
  contexto:
    'Drawer lateral (direita por padrão). Use para edição sem perder contexto da tela anterior — clica no item da lista, abre Sheet com form. Em mobile, side="bottom" vira bottom sheet.',
  quandoUsar: [
    'Edição inline sem sair da listagem',
    'Forms médios (5-15 campos)',
    'Mobile · side="bottom" para preview/ação contextual',
    'Filtros avançados que não cabem na sidebar',
  ],
  props: [
    { name: 'side', type: '"top" | "right" | "bottom" | "left"', description: 'Direção · "right" padrão' },
    { name: 'open / onOpenChange', type: 'controlled', description: 'Estado externo' },
  ],
  antiPatterns: [
    'Sheet para forms enormes (20+ campos) — vire Wizard',
    'Sheet acima de Dialog (overlay stack confuso)',
  ],
  exemplo: `<Sheet>
  <SheetTrigger asChild><Button>Editar</Button></SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Editar projeto</SheetTitle>
      <SheetDescription>Yachthouse 2104</SheetDescription>
    </SheetHeader>
    {/* campos */}
    <SheetFooter><Button>Salvar</Button></SheetFooter>
  </SheetContent>
</Sheet>`,
  relacionados: ['Dialog', 'Drawer (vaul)'],
}

export function SheetPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="09.3"
        category="Overlays · Sheet"
        title="Sheet · Drawer"
        italic="lateral · bottom (mobile)"
        description="Drawer para edição contextual. Side=right padrão; side=bottom em mobile vira bottom sheet."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Edição lateral" />
      <Showcase>
        <Sheet>
          <SheetTrigger asChild>
            <Button>Editar Yachthouse 2104</Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Editar projeto</SheetTitle>
              <SheetDescription>Yachthouse 2104 · #2410</SheetDescription>
            </SheetHeader>
            <div className="mt-5 grid gap-4">
              <Field>
                <Label htmlFor="s-nm" required>Nome</Label>
                <Input id="s-nm" defaultValue="Yachthouse 2104" />
              </Field>
              <Field>
                <Label htmlFor="s-cl">Cliente</Label>
                <Input id="s-cl" defaultValue="Família Andrade" />
              </Field>
              <Field>
                <Label htmlFor="s-obs">Observações</Label>
                <Textarea id="s-obs" rows={4} placeholder="Notas para o squad…" />
              </Field>
            </div>
            <SheetFooter>
              <Button variant="ghost">Cancelar</Button>
              <Button>Salvar alterações</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Showcase>
    </div>
  )
}
