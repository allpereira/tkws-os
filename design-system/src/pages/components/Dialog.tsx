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
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Dialog',
  import: "import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'",
  contexto:
    'Dialog modal centralizado. Use para confirmar ações que não são destrutivas (criar item, escolher opção) ou para forms quick-create de ≤3 campos. Para forms longos, use Sheet. Para ações destrutivas, use AlertDialog.',
  quandoUsar: [
    'Quick-create modal · ≤ 3 campos',
    'Diálogos informativos focados (Sobre, Política)',
    'Escolha de modalidade quando muito visual (não cabe em Dropdown)',
  ],
  props: [
    { name: 'open / onOpenChange', type: 'controlled', description: 'Estado externo · útil com TanStack Query mutation' },
    { name: 'modal', type: 'boolean', description: 'Default true. False permite cliques fora.' },
  ],
  antiPatterns: [
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
        description="Modal acessível via Radix. Use para quick-create (≤3 campos) ou informativo. Forms longos vão para Sheet."
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
    </div>
  )
}
