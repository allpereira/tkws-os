import { PageHeader } from '@/components/docs/PageHeader'
import { Showcase, SubHead } from '@/components/docs/Showcase'
import { PromptCard } from '@/components/docs/PromptCard'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import type { AIPrompt } from '@/lib/prompts'

const prompt: AIPrompt = {
  componente: 'Resizable',
  import: "import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'",
  contexto:
    'Split panel arrastável (react-resizable-panels). Use em IDE-like layouts · 2 painéis (lista + detalhe) ou 3 painéis (sidebar + lista + detalhe). Persista os tamanhos via id + autoSaveId.',
  quandoUsar: [
    'IDE-like layout (Plugin SketchUp, modo Power)',
    'Email-style 2-3 panel layout',
    'Editor split (texto + preview)',
  ],
  props: [
    { name: 'direction', type: '"horizontal" | "vertical"', description: 'Orientação do split' },
    { name: 'defaultSize / minSize / maxSize (Panel)', type: 'number (%)', description: 'Tamanho em %' },
    { name: 'withHandle (Handle)', type: 'boolean', description: 'Mostra ícone grip' },
    { name: 'autoSaveId (Group)', type: 'string', description: 'Persiste tamanhos no localStorage' },
  ],
  antiPatterns: [
    'Resizable em mobile · perde UX · vire Tabs ou stack',
    'Sem minSize · usuário fecha painel acidentalmente',
  ],
  exemplo: `<ResizablePanelGroup direction="horizontal" autoSaveId="projects-layout">
  <ResizablePanel defaultSize={30} minSize={20}>Lista</ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize={70}>Detalhe</ResizablePanel>
</ResizablePanelGroup>`,
  relacionados: ['Sidebar', 'Sheet'],
}

export function ResizablePage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        num="11.10"
        category="Layout · Resizable"
        title="Resizable"
        italic="split panels"
        description="Painéis arrastáveis. Use em layouts IDE/email. Persista via autoSaveId."
      />
      <PromptCard prompt={prompt} />

      <SubHead num="A" title="Horizontal · lista + detalhe" />
      <Showcase padding="none">
        <div className="h-[320px]">
          <ResizablePanelGroup direction="horizontal" autoSaveId="ds-resizable-h">
            <ResizablePanel defaultSize={30} minSize={20}>
              <div className="flex h-full items-center justify-center" style={{ background: 'var(--surface-2)' }}>
                <div className="text-center">
                  <div className="mono text-[10.5px] font-bold uppercase tracking-[1.6px]" style={{ color: 'var(--text-mute)' }}>
                    Lista
                  </div>
                  <div className="serif mt-2 text-[20px] font-light" style={{ color: 'var(--text)' }}>
                    43 projetos
                  </div>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={70}>
              <div className="flex h-full items-center justify-center" style={{ background: 'var(--surface-1)' }}>
                <div className="text-center">
                  <div className="mono text-[10.5px] font-bold uppercase tracking-[1.6px]" style={{ color: 'var(--text-mute)' }}>
                    Detalhe
                  </div>
                  <div className="serif mt-2 text-[24px] font-light" style={{ color: 'var(--text)' }}>
                    Yachthouse 2104
                  </div>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </Showcase>

      <SubHead num="B" title="Vertical · split editor" />
      <Showcase padding="none">
        <div className="h-[320px]">
          <ResizablePanelGroup direction="vertical" autoSaveId="ds-resizable-v">
            <ResizablePanel defaultSize={60} minSize={20}>
              <div className="flex h-full items-center justify-center" style={{ background: 'var(--surface-1)' }}>
                <span className="mono text-[11px] font-bold uppercase tracking-[1.6px]" style={{ color: 'var(--text-mute)' }}>Editor</span>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={40} minSize={20}>
              <div className="flex h-full items-center justify-center" style={{ background: 'var(--surface-2)' }}>
                <span className="mono text-[11px] font-bold uppercase tracking-[1.6px]" style={{ color: 'var(--text-mute)' }}>Preview</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </Showcase>
    </div>
  )
}
