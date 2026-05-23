import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Alert',
  import: "import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'",
  contexto:
    'Alert inline: mensagem informativa, atenção ou erro dentro do conteúdo. 5 tons (info, success, warning, alert, danger). Para notificações flutuantes, use Toast (sonner).',
  quandoUsar: [
    'Estado do form que precisa explicação (info/erro de validação não-inline)',
    'Aviso permanente em tela (manutenção, modo demo, atraso crítico)',
    'Confirmação inline pós-ação quando Toast é insuficiente',
  ],
  props: [
    { name: 'tone', type: '"info" | "success" | "warning" | "alert" | "danger"', description: 'Cor semântica' },
    { name: 'hideIcon', type: 'boolean', description: 'Esconde ícone à esquerda' },
  ],
  antiPatterns: [
    'Alert para feedback efêmero · use Toast',
    'Alert empilhado (3+ alerts) · concentre em um',
  ],
  exemplo: `<Alert tone="warning">
  <AlertTitle>3 documentos vencem em 7 dias</AlertTitle>
  <AlertDescription>
    Contrato da Yachthouse 2104 e mais 2. <a className="underline">Ver lista</a>
  </AlertDescription>
</Alert>`,
  relacionados: ['Toast (sonner)', 'Badge'],
}

export function AlertPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="10.1"
        category="Feedback · Alert"
        title="Alert"
        italic="inline · 5 tons"
        description="Mensagem inline dentro do conteúdo. Para feedback efêmero (ação concluída), use Toast."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="5 tons" italic="info · success · warning · alert · danger" />
      <Showcase>
        <div className="grid gap-3">
          <Alert tone="info">
            <AlertTitle>Modo demonstração</AlertTitle>
            <AlertDescription>Os dados desta tela são fictícios. Nenhuma alteração é persistida.</AlertDescription>
          </Alert>
          <Alert tone="success">
            <AlertTitle>Orçamento aprovado pelo cliente</AlertTitle>
            <AlertDescription>Yachthouse 2104 · R$ 12,5M · assinado em 14/03 às 09:42.</AlertDescription>
          </Alert>
          <Alert tone="warning">
            <AlertTitle>3 documentos vencem em 7 dias</AlertTitle>
            <AlertDescription>Contrato + 2 documentos · revise antes de 28/03.</AlertDescription>
          </Alert>
          <Alert tone="alert">
            <AlertTitle>Margem abaixo do target</AlertTitle>
            <AlertDescription>23% vs 30% planejados. Reveja a curva de fornecedores.</AlertDescription>
          </Alert>
          <Alert tone="danger">
            <AlertTitle>Obra atrasada · 8 dias</AlertTitle>
            <AlertDescription>Entrega do granito São Gabriel atrasou. Replanejar cronograma.</AlertDescription>
          </Alert>
        </div>
      </Showcase>
    </div>
  )
}
