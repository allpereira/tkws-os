import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input, Field } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Dialog',
  import: "import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'",
  contexto:
    'Dialog modal centralizado via **Radix Dialog** (nunca `<dialog showModal>` HTML5). Select, Popover e DatePicker portaled funcionam dentro do modal. Use para quick-create ou forms curtos; forms longos → Sheet; destrutivo → AlertDialog.',
  quandoUsar: [
    'Quick-create modal · ≤ 3 campos (ou pouco mais com Select/Date)',
    'Formulário com Select, Popover ou calendário no corpo do modal',
    'Diálogos informativos focados (Sobre, Política)',
    'Estado controlado: `<Dialog open={open} onOpenChange={setOpen}>`',
  ],
  props: [
    { name: 'open / onOpenChange', type: 'controlled', description: 'Estado externo · útil com TanStack Query mutation' },
    { name: 'modal', type: 'boolean', description: 'Default true. False permite cliques fora.' },
  ],
  antiPatterns: [
    '`<dialog showModal>` nativo · quebra Select/Popover (top layer do browser)',
    'Dialog com 10+ campos · vire Sheet ou Wizard',
    'Dialog para confirmação destrutiva · use AlertDialog',
    'Dialog para preview · use HoverCard ou Popover',
  ],
  exemplo: `<Dialog>
  <DialogTrigger asChild>
    <Button>Novo cliente</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Novo cliente</DialogTitle>
      <DialogDescription>Cadastre o cliente em 3 campos.</DialogDescription>
    </DialogHeader>
    <Field>
      <Label htmlFor="nm">Nome</Label>
      <Input id="nm" />
    </Field>
    <DialogFooter>
      <DialogClose asChild><Button variant="ghost">Cancelar</Button></DialogClose>
      <Button>Cadastrar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
  relacionados: ['AlertDialog', 'Sheet'],
}

export function DialogPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="09.1"
        category="Overlays · Dialog"
        title="Dialog"
        italic="modal centralizado"
        description="Radix Dialog · compatível com Select e Popover no corpo. Nunca use `<dialog>` HTML5 com showModal."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Quick-create" italic="≤ 3 campos" />
      <Showcase>
        <Dialog>
          <DialogTrigger asChild>
            <Button>+ Novo cliente</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo cliente</DialogTitle>
              <DialogDescription>
                Cadastre rapidamente com os 3 campos essenciais. Detalhes ficam para depois.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <div className="grid gap-4">
                <Field>
                  <Label htmlFor="d-nm" required>Nome / Razão social</Label>
                  <Input id="d-nm" placeholder="ex: Família Andrade" />
                </Field>
                <Field>
                  <Label htmlFor="d-cnpj">CNPJ / CPF</Label>
                  <Input id="d-cnpj" placeholder="00.000.000/0000-00" />
                </Field>
                <Field>
                  <Label htmlFor="d-ph">Telefone</Label>
                  <Input id="d-ph" placeholder="(47) 98xxx-xxxx" />
                </Field>
              </div>
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancelar</Button>
              </DialogClose>
              <Button>Cadastrar cliente</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Showcase>

      <SubHead num="B" title="Com Select" italic="overlays no modal" />
      <Showcase>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Nova oportunidade</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nova oportunidade</DialogTitle>
              <DialogDescription>
                Select e Popover portaled em z-[100] · modal em z-50. Clique nas opções para validar.
              </DialogDescription>
            </DialogHeader>
            <DialogBody>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Label required>Etapa</Label>
                  <Select defaultValue="briefing">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a etapa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="briefing">Briefing</SelectItem>
                      <SelectItem value="proposta">Proposta</SelectItem>
                      <SelectItem value="fechado">Fechado</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <Label>Pessoa</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o contato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">Família Andrade</SelectItem>
                      <SelectItem value="b">Studio Nogueira</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancelar</Button>
              </DialogClose>
              <Button>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Showcase>
    </div>
  )
}
