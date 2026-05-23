import { useState } from 'react'
import { Maximize2 } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input, Field } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle'
import { Slider } from '@/components/ui/slider'
import { Spinner } from '@/components/ui/spinner'
import { Progress } from '@/components/ui/progress'
import { FilterSection, FilterSidebar } from '@/components/tkws/filter-sidebar'
import { toast } from 'sonner'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Pattern · Overlay variantes',
  import: '// Composição: Dialog (quick-create, full-screen, async loading) + Sheet (edit drawer, filter drawer)',
  contexto:
    'Padrões de overlay TKWS · cada um para um caso específico:\n• QUICK-CREATE MODAL · 3 campos · use Dialog\n• FULL-SCREEN MODAL · forms intensos · Dialog max-w-screen\n• ASYNC LOADING MODAL · processo > 5s · Dialog com Progress + Spinner\n• EDIT DRAWER · edição lateral · use Sheet right\n• FILTER DRAWER · refinamento avançado · use Sheet right wider',
  quandoUsar: [
    'Quick-create · cadastros rápidos (cliente, tag, item de lista)',
    'Full-screen · briefing rico, criação de orçamento, editor visual',
    'Async loading · sincronizar catálogo, importar planilha, gerar PDF',
    'Edit drawer · editar projeto/cliente sem sair do contexto',
    'Filter drawer · 8+ critérios de filtro avançado',
  ],
  props: [],
  antiPatterns: [
    'Quick-create com mais de 3 campos · use Sheet ou tela',
    'Async modal sem progress · usuário acha que travou',
    'Full-screen para tudo · perde contexto e cliques de "voltar"',
  ],
  exemplo: `// Async loading com cancelamento
const { mutate, isPending } = useMutation(...)
<Dialog open={isPending}>
  <DialogContent>
    <Spinner /> Processando…
    <Progress value={progress} />
    <Button variant="ghost" onClick={cancel}>Cancelar</Button>
  </DialogContent>
</Dialog>`,
  relacionados: ['Dialog', 'Sheet', 'Drawer'],
}

export function OverlaysPattern() {
  const [progress, setProgress] = useState(64)
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="P12"
        category="Pattern · Overlays"
        title="Overlay variantes"
        italic="quick · full-screen · async · edit drawer · filter drawer"
        description="5 padrões de overlay TKWS. Cada um para um caso específico — escolha pelo tamanho do form e contexto."
        tag="5 padrões"
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Quick-create modal · ≤ 3 campos" />
      <Showcase>
        <Dialog>
          <DialogTrigger asChild>
            <Button>+ Novo cliente (quick)</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo cliente</DialogTitle>
              <DialogDescription>Cadastre rápido · 3 campos essenciais</DialogDescription>
            </DialogHeader>
            <DialogBody>
              <div className="grid gap-3">
                <Field>
                  <Label required>Nome</Label>
                  <Input placeholder="ex: Família Andrade" />
                </Field>
                <Field>
                  <Label>CPF/CNPJ</Label>
                  <Input placeholder="000.000.000-00" />
                </Field>
                <Field>
                  <Label>Telefone</Label>
                  <Input placeholder="(47) 98xxx-xxxx" />
                </Field>
              </div>
            </DialogBody>
            <DialogFooter>
              <Button variant="ghost">Cancelar</Button>
              <Button>Cadastrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Showcase>

      <SubHead num="B" title="Full-screen modal · briefing rico" />
      <Showcase>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Maximize2 size={13} /> Abrir briefing completo
            </Button>
          </DialogTrigger>
          <DialogContent
            className="!max-w-screen !top-0 !left-0 !translate-x-0 !translate-y-0 !h-screen !w-screen !rounded-none"
            style={{ height: '100vh', width: '100vw', maxWidth: 'none' }}
          >
            <DialogHeader>
              <div
                className="mono text-[10.5px] font-bold uppercase tracking-[1.6px]"
                style={{ color: 'var(--brand)' }}
              >
                BRIEFING · YACHTHOUSE 2104
              </div>
              <DialogTitle className="!text-[32px]">
                Briefing completo
              </DialogTitle>
              <DialogDescription>
                Modal full-screen para entrada de dados intensa · sem perder contexto do projeto
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <div className="grid grid-cols-2 gap-5 max-[760px]:grid-cols-1">
                <Field>
                  <Label>Programa de ambientes</Label>
                  <Textarea rows={6} placeholder="Living · jantar · cozinha · 3 suítes · 1 escritório…" />
                </Field>
                <Field>
                  <Label>Restrições e premissas</Label>
                  <Textarea rows={6} placeholder="Não pode mexer em alvenaria estrutural · prazo fixo de 6 meses…" />
                </Field>
                <Field>
                  <Label>Referências (links)</Label>
                  <Textarea rows={4} placeholder="Pinterest · Are.na · Instagram…" />
                </Field>
                <Field>
                  <Label>Observações da entrevista</Label>
                  <Textarea rows={4} placeholder="Notas livres do brainstorm com cliente…" />
                </Field>
              </div>
            </DialogBody>
            <DialogFooter>
              <Button variant="ghost">Cancelar</Button>
              <Button>Salvar briefing</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Showcase>

      <SubHead num="C" title="Async loading modal · processo longo" />
      <Showcase>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Simular sincronização longa</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sincronizando catálogo</DialogTitle>
              <DialogDescription>
                Aguarde · estamos importando 1.847 produtos do fornecedor.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <div className="grid gap-4">
                <div className="flex items-center justify-center">
                  <Spinner size={32} tone="brand" />
                </div>
                <Progress value={progress} />
                <div className="mono text-center text-[10.5px] font-bold uppercase tracking-[1.4px]" style={{ color: 'var(--text-mute)' }}>
                  {progress}% · 18s restantes · {Math.floor((progress / 100) * 1847)}/1847 produtos
                </div>
              </div>
            </DialogBody>
            <DialogFooter>
              <Button variant="ghost" onClick={() => toast.warning('Sincronização cancelada · dados parciais salvos')}>
                Cancelar e usar parcial
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Showcase>

      <SubHead num="D" title="Edit drawer · edição lateral" />
      <Showcase>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Editar Yachthouse 2104</Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Editar projeto</SheetTitle>
              <SheetDescription>Yachthouse 2104 · #2410</SheetDescription>
            </SheetHeader>
            <div className="mt-5 grid gap-4">
              <Field>
                <Label required>Nome</Label>
                <Input defaultValue="Yachthouse 2104" />
              </Field>
              <Field>
                <Label>Cliente</Label>
                <Input defaultValue="Família Andrade" />
              </Field>
              <Field>
                <Label>Observações</Label>
                <Textarea rows={4} />
              </Field>
            </div>
            <SheetFooter>
              <Button variant="ghost">Cancelar</Button>
              <Button>Salvar</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Showcase>

      <SubHead num="E" title="Filter drawer · refinamento avançado" />
      <Showcase>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Mais filtros</Button>
          </SheetTrigger>
          <SheetContent side="right" className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Filtros avançados</SheetTitle>
              <SheetDescription>Refine a listagem de projetos</SheetDescription>
            </SheetHeader>
            <div className="mt-5 grid gap-5">
              <FilterSidebar title="">
                <FilterSection label="Squad">
                  <ToggleGroup type="multiple" defaultValue={['orion']}>
                    <ToggleGroupItem value="orion">Orion</ToggleGroupItem>
                    <ToggleGroupItem value="apollo">Apollo</ToggleGroupItem>
                    <ToggleGroupItem value="neptune">Neptune</ToggleGroupItem>
                  </ToggleGroup>
                </FilterSection>
                <FilterSection label="Status">
                  <ToggleGroup type="multiple">
                    <ToggleGroupItem value="briefing">Briefing</ToggleGroupItem>
                    <ToggleGroupItem value="obra">Em obra</ToggleGroupItem>
                    <ToggleGroupItem value="entrega">Entregando</ToggleGroupItem>
                  </ToggleGroup>
                </FilterSection>
                <FilterSection label="Valor (R$ M)">
                  <Slider defaultValue={[0.4, 20]} min={0.4} max={30} step={0.1} />
                </FilterSection>
                <FilterSection label="Margem alvo (%)">
                  <Slider defaultValue={[20, 60]} min={0} max={100} step={1} />
                </FilterSection>
              </FilterSidebar>
            </div>
            <SheetFooter>
              <Button variant="ghost">Limpar tudo</Button>
              <Button>Aplicar (8 filtros)</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Showcase>
    </div>
  )
}
