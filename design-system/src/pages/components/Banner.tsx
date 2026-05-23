import { useState } from 'react'
import { AlertTriangle, Info, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { Banner } from '@/components/ui/banner'
import { Button } from '@/components/ui/button'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Banner',
  import: "import { Banner } from '@/components/ui/banner'",
  contexto:
    'Faixa horizontal de anúncio · use para modo manutenção, comunicado global, alerta de plano. Diferente de Alert (inline em conteúdo): Banner ocupa toda a largura. Position top/bottom fixa na viewport.',
  quandoUsar: [
    'Modo demonstração ativo · sticky no topo',
    'Comunicado global (manutenção, novo recurso)',
    'Alerta de limite de plano · convite para upgrade',
  ],
  props: [
    { name: 'tone', type: '"info" | "success" | "warning" | "alert" | "danger" | "brand"', description: 'Cor semântica' },
    { name: 'position', type: '"top" | "bottom" | "inline"', description: 'inline = no fluxo · top/bottom = fixed' },
    { name: 'onClose', type: '() => void', description: 'Mostra X de fechar' },
    { name: 'icon', type: 'ReactNode', description: 'Ícone à esquerda' },
  ],
  antiPatterns: [
    'Banner permanente em zona crítica · perde atenção',
    'Banner sem onClose para mensagens dispensáveis',
  ],
  exemplo: `<Banner
  position="top"
  tone="warning"
  icon={<AlertTriangle size={14}/>}
  onClose={() => setShow(false)}
>
  <b>Manutenção programada:</b> Sábado · 22/03 das 02h às 04h. Saved views ficam offline.
</Banner>`,
  relacionados: ['Alert', 'Toast'],
}

export function BannerPage() {
  const [show, setShow] = useState(true)
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="10.10"
        category="Feedback · Banner"
        title="Banner"
        italic="faixa global"
        description="Anúncio horizontal full-width. Para inline em conteúdo, use Alert. Fixed top/bottom em mode app-wide."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Inline · tons" />
      <Showcase padding="none">
        <div className="space-y-3 p-4">
          {show && (
            <Banner
              tone="brand"
              icon={<Sparkles size={14} strokeWidth={1.7} />}
              onClose={() => setShow(false)}
            >
              <b>Novo recurso:</b> agora você pode comentar diretamente sobre as plantas no portal do cliente.
            </Banner>
          )}
          <Banner tone="warning" icon={<AlertTriangle size={14} strokeWidth={1.7} />}>
            <b>Manutenção programada:</b> Sábado · 22/05 das 02h às 04h. Saved views ficam offline.
          </Banner>
          <Banner tone="danger" icon={<AlertTriangle size={14} strokeWidth={1.7} />}>
            <b>Limite do plano:</b> 90% dos 50 projetos · <Button variant="outline" size="sm">Fazer upgrade</Button>
          </Banner>
          <Banner tone="info" icon={<Info size={14} strokeWidth={1.7} />}>
            Dados desta tela são fictícios · modo demonstração.
          </Banner>
        </div>
      </Showcase>
    </div>
  )
}
