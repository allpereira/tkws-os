import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Drawer (vaul)',
  import: "import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@/components/ui/drawer'",
  contexto:
    'Drawer mobile-first (vaul) · entra de baixo com gesto drag-to-dismiss. Use em mobile para ações contextuais e em desktop para previews leves. Diferente do Sheet (lateral): Drawer é bottom + touch native.',
  quandoUsar: [
    'Ações mobile (capacitor app) · bottom sheet nativo',
    'Filtros rápidos em mobile · alternativa ao Sheet lateral',
    'Preview de item com gesto drag-down dismiss',
  ],
  props: [
    { name: 'open / onOpenChange', type: 'controlled', description: 'Estado externo' },
    { name: 'shouldScaleBackground', type: 'boolean', description: 'Default true · efeito iOS' },
  ],
  antiPatterns: [
    'Drawer com form longo · usuário não consegue ver tudo · use Sheet ou tela',
    'Drawer + Dialog ao mesmo tempo · stacking confuso',
  ],
  exemplo: `<Drawer>
  <DrawerTrigger asChild><Button>Filtrar</Button></DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Filtros</DrawerTitle>
      <DrawerDescription>Refine a lista de projetos</DrawerDescription>
    </DrawerHeader>
    {/* filtros */}
    <DrawerFooter>
      <Button>Aplicar</Button>
      <DrawerClose asChild><Button variant="ghost">Cancelar</Button></DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>`,
  relacionados: ['Sheet', 'Dialog'],
}

export function DrawerPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="09.10"
        category="Overlays · Drawer"
        title="Drawer (vaul)"
        italic="bottom sheet com gesto"
        description="Drawer mobile-first. Entra de baixo, suporta drag-to-dismiss. Alternativa ao Sheet em mobile."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Filtros mobile" />
      <Showcase>
        <Drawer>
          <DrawerTrigger asChild>
            <Button>Abrir filtros</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Filtrar projetos</DrawerTitle>
              <DrawerDescription>Refine a listagem por valor e status</DrawerDescription>
            </DrawerHeader>
            <div className="grid gap-4 px-5">
              <div>
                <Label>Valor do contrato</Label>
                <div className="mt-3">
                  <Slider defaultValue={[400_000, 12_000_000]} min={400_000} max={20_000_000} step={50_000} />
                </div>
              </div>
            </div>
            <DrawerFooter>
              <Button>Aplicar filtros</Button>
              <DrawerClose asChild>
                <Button variant="ghost">Cancelar</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Showcase>
    </div>
  )
}
