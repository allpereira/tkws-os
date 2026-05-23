import { toast } from 'sonner'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'AlertDialog',
  import: "import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog'",
  contexto:
    'Confirmação de ação destrutiva ou irreversível. NÃO fecha em ESC ou clique fora (Radix força ação consciente). Sempre tenha 2 botões: Cancelar (ghost) + Confirmar (danger).',
  quandoUsar: [
    'Excluir projeto, cliente, fornecedor',
    'Arquivar/desativar/desligar irreversivelmente',
    'Sair de wizard com alterações não salvas',
  ],
  props: [],
  antiPatterns: [
    'AlertDialog para fluxos não destrutivos · use Dialog',
    'Action sem variant="danger" · sinaliza errado',
    'Texto vago em description · seja explícito sobre o que será perdido',
  ],
  exemplo: `<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="danger">Excluir projeto</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Excluir Yachthouse 2104?</AlertDialogTitle>
      <AlertDialogDescription>
        Esta ação não pode ser desfeita. Todos os documentos e orçamentos associados
        serão arquivados em /trash por 30 dias.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel asChild><Button variant="ghost">Cancelar</Button></AlertDialogCancel>
      <AlertDialogAction asChild><Button variant="danger">Sim, excluir</Button></AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,
  relacionados: ['Dialog', 'Toast'],
}

export function AlertDialogPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="09.2"
        category="Overlays · AlertDialog"
        title="Alert Dialog"
        italic="confirmação destrutiva"
        description="Para ações irreversíveis. Não fecha em ESC ou clique fora — força ação consciente do usuário."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Excluir registro" />
      <Showcase>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="danger">Excluir projeto</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir Yachthouse 2104?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Todos os documentos, orçamentos e
                mensagens associados serão arquivados em <code>/trash</code> por 30 dias.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="ghost">Cancelar</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button variant="danger" onClick={() => toast.success('Projeto excluído. Você tem 30 dias para reverter.')}>
                  Sim, excluir
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Showcase>
    </div>
  )
}
